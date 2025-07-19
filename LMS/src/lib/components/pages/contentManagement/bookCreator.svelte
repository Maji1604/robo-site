<script lang="ts">
  import { writable } from 'svelte/store';
  import { dndzone } from 'svelte-dnd-action';
  import Quill from 'svelte-quill';
  import { v4 as uuid } from 'uuid';
  import { createQuery, createMutation } from '@tanstack/svelte-query';
  import axios from 'axios';
  import Button from '$lib/components/ui/button/button.svelte';

  // Type definitions
  interface Element {
    id: string;
    type: 'text' | 'image';
    content?: string;
    delta?: string;
    src?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    style?: string;
  }

  interface Page {
    id: string;
    elements: Element[];
  }

  export let book: {
    id: string | null;
    title: string;
    author: string;
    grade: string;
  };

  // Function to save the book
  function saveBook() {
    console.log('Book saved:', book);
  }

  // Mock backend data store
  let mockDb: Page[] = [{ id: uuid(), elements: [] }];

  // Mock API functions
  async function fetchPages() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockDb };
  }

  async function updatePages(data: Page[]) {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockDb = data;
    return { data: mockDb };
  }

  // TanStack Query setup
  const query = createQuery({
    queryKey: ['pages'],
    queryFn: fetchPages
  });

  const updatePagesMutation = createMutation({
    mutationFn: updatePages
  });

  // Store for pages
  const pages = writable<Page[]>([{ id: uuid(), elements: [] }]);
  let currentPageIndex: number = 0;
  let selectedElement: string | null = null;
  let isDragging: boolean = false;
  let isResizing: boolean = false;
  let isEditingText: boolean = false;

  // Sync query data with store
  $: if ($query.data?.data) {
    pages.set($query.data.data);
  }

  // Get current page elements
  $: currentPage = $pages[currentPageIndex];
  $: currentElements = currentPage?.elements ?? [];
  $: selectedElementData = currentElements.find(el => el.id === selectedElement);

  // Create a new page
  function createPage(): Page {
    return {
      id: uuid(),
      elements: []
    };
  }

  // Add a new page
  function addPage() {
    pages.update(p => {
      const newPages = [...p, createPage()];
      $updatePagesMutation.mutate(newPages);
      return newPages;
    });
    currentPageIndex = $pages.length - 1;
  }

  // Navigate pages
  function nextPage() {
    if (currentPageIndex < $pages.length - 1) currentPageIndex++;
  }

  function prevPage() {
    if (currentPageIndex > 0) currentPageIndex--;
  }

  // Add a text block
  function addTextBlock() {
    const newElement: Element = {
      id: uuid(),
      type: 'text',
      content: 'Click to edit text',
      delta: JSON.stringify({ ops: [{ insert: 'Click to edit text\n' }] }),
      x: 50 + Math.random() * 200,
      y: 50 + Math.random() * 200,
      width: 300,
      height: 150,
      zIndex: Math.max(0, ...currentElements.map(el => el.zIndex)) + 1,
      style: 'font-size:16px; font-weight:normal;'
    };
    pages.update(p => {
      p[currentPageIndex].elements = [...p[currentPageIndex].elements, newElement];
      $updatePagesMutation.mutate(p);
      return [...p];
    });
    selectedElement = newElement.id;
  }

  // Add an image block
  function addImageBlock() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const newElement: Element = {
            id: uuid(),
            type: 'image',
            src: reader.result as string,
            x: 100 + Math.random() * 200,
            y: 100 + Math.random() * 200,
            width: 200,
            height: 150,
            zIndex: Math.max(0, ...currentElements.map(el => el.zIndex)) + 1
          };
          pages.update(p => {
            p[currentPageIndex].elements = [...p[currentPageIndex].elements, newElement];
            $updatePagesMutation.mutate(p);
            return [...p];
          });
          selectedElement = newElement.id;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  // Enhanced manual drag functionality
  function handleMouseDown(id: string, e: MouseEvent) {
    if (e.target instanceof HTMLElement) {
      if (e.target.tagName === 'TEXTAREA' ||
          e.target.closest('.handle') ||
          e.target.closest('.resize-handle')) {
        return;
      }
    }

    e.preventDefault();
    e.stopPropagation();
    isDragging = true;
    selectedElement = id;

    const element = currentElements.find(el => el.id === id);
    if (!element) return;

    const canvas = document.querySelector('.page') as HTMLElement;
    const canvasRect = canvas.getBoundingClientRect();

    const shiftX = e.clientX - canvasRect.left - element.x;
    const shiftY = e.clientY - canvasRect.top - element.y;

    function moveAt(clientX: number, clientY: number) {
      const newX = clientX - canvasRect.left - shiftX;
      const newY = clientY - canvasRect.top - shiftY;

      pages.update(p => {
        const el = p[currentPageIndex].elements.find(el => el.id === id);
        if (el) {
          el.x = Math.max(0, Math.min(800 - el.width, newX));
          el.y = Math.max(0, Math.min(600 - el.height, newY));
        }
        return [...p];
      });
    }

    function onMouseMove(event: MouseEvent) {
      moveAt(event.clientX, event.clientY);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', onMouseMove);
      isDragging = false;
      $updatePagesMutation.mutate($pages);
    }, { once: true });
  }

  // Handle resize
  function handleResize(id: string, handle: string, e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    isResizing = true;

    const element = currentElements.find(el => el.id === id);
    if (!element) return;

    const canvas = document.querySelector('.page') as HTMLElement;
    const canvasRect = canvas.getBoundingClientRect();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.width;
    const startHeight = element.height;
    const startLeft = element.x;
    const startTop = element.y;

    function onMouseMove(event: MouseEvent) {
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;

      pages.update(p => {
        const el = p[currentPageIndex].elements.find(el => el.id === id);
        if (el) {
          switch (handle) {
            case 'se':
              el.width = Math.max(50, startWidth + deltaX);
              el.height = Math.max(30, startHeight + deltaY);
              break;
            case 'sw':
              el.width = Math.max(50, startWidth - deltaX);
              el.height = Math.max(30, startHeight + deltaY);
              el.x = Math.max(0, startLeft + deltaX);
              break;
            case 'ne':
              el.width = Math.max(50, startWidth + deltaX);
              el.height = Math.max(30, startHeight - deltaY);
              el.y = Math.max(0, startTop + deltaY);
              break;
            case 'nw':
              el.width = Math.max(50, startWidth - deltaX);
              el.height = Math.max(30, startHeight - deltaY);
              el.x = Math.max(0, startLeft + deltaX);
              el.y = Math.max(0, startTop + deltaY);
              break;
          }

          if (el.x + el.width > 800) el.width = 800 - el.x;
          if (el.y + el.height > 600) el.height = 600 - el.y;
        }
        return [...p];
      });
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', onMouseMove);
      isResizing = false;
      $updatePagesMutation.mutate($pages);
    }, { once: true });
  }

  // Handle text content change
  function handleTextChange(id: string, content: string) {
    pages.update(p => {
      const element = p[currentPageIndex].elements.find(el => el.id === id);
      if (element) {
        element.content = content;
      }
      return [...p];
    });
    debounceUpdate();
  }

  // Debounced update function
  let updateTimeout: NodeJS.Timeout;
  function debounceUpdate() {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      $updatePagesMutation.mutate($pages);
    }, 500);
  }

  // Delete selected element
  function deleteSelectedElement() {
    if (selectedElement) {
      pages.update(p => {
        p[currentPageIndex].elements = p[currentPageIndex].elements.filter(el => el.id !== selectedElement);
        $updatePagesMutation.mutate(p);
        return [...p];
      });
      selectedElement = null;
    }
  }

  // Handle canvas click
  function handleCanvasClick(e: MouseEvent) {
    if (e.target === e.currentTarget && !isDragging && !isResizing) {
      selectedElement = null;
      isEditingText = false;
    }
  }

  // Handle element click
  function handleElementClick(id: string, e: MouseEvent) {
    e.stopPropagation();
    if (!isDragging && !isResizing) {
      selectedElement = id;
      const element = currentElements.find(el => el.id === id);
      if (element?.type === 'text' && e.target instanceof HTMLTextAreaElement) {
        isEditingText = true;
      }
    }
  }

  // Handle double click on text to edit
  function handleTextDoubleClick(id: string, e: MouseEvent) {
    e.stopPropagation();
    selectedElement = id;
    isEditingText = true;
    setTimeout(() => {
      const textarea = e.target as HTMLTextAreaElement;
      textarea.focus();
    }, 0);
  }

  // Update element property directly from properties panel
  function updateElementProperty(id: string, property: string, value: any) {
    pages.update(p => {
      const element = p[currentPageIndex].elements.find(el => el.id === id);
      if (element) {
        (element as any)[property] = value;

        if (property === 'width' || property === 'x') {
          element.x = Math.max(0, Math.min(800 - element.width, element.x));
          element.width = Math.max(50, Math.min(800 - element.x, element.width));
        }
        if (property === 'height' || property === 'y') {
          element.y = Math.max(0, Math.min(600 - element.height, element.y));
          element.height = Math.max(30, Math.min(600 - element.y, element.height));
        }
      }
      return [...p];
    });
    debounceUpdate();
  }

  // Keyboard shortcuts
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Delete' && selectedElement && !isEditingText) {
      deleteSelectedElement();
    }
    if (e.key === 'Escape') {
      isEditingText = false;
    }
  }

  // Minimize/maximize functionality
  let isSidebarMinimized = false;
  let isPropertiesPanelMinimized = false;

  function toggleSidebar() {
    isSidebarMinimized = !isSidebarMinimized;
  }

  function togglePropertiesPanel() {
    isPropertiesPanelMinimized = !isPropertiesPanelMinimized;
  }
</script>

<svelte:head>
  <title>Presentation Builder</title>
  <meta name="description" content="Create presentations with draggable text and images" />
  <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet" />
  <script src="https://code.iconify.design/iconify-icon/1.0.0-beta.3/iconify-icon.min.js"></script>
</svelte:head>

<svelte:window on:keydown={handleKeyDown} />

<div class="flex h-screen ">
  <!-- Sidebar -->
  <div class={`bg-white shadow-md h-fit p-4 flex flex-col gap-4 transition-all duration-300 ${isSidebarMinimized ? 'w-16' : 'w-64'}`}>
    <div class="flex justify-end">
      <button onclick={toggleSidebar} class="text-gray-600 hover:text-gray-900">
        <iconify-icon icon={isSidebarMinimized ? "mdi:chevron-right" : "mdi:chevron-left"} width="24" height="24"></iconify-icon>
      </button>
    </div>
    {#if !isSidebarMinimized}
      {#if $query.isLoading}
        <p>Loading...</p>
      {:else if $query.isError}
        <p class="text-red-500">Error loading pages</p>
      {/if}
      <div class="flex flex-col gap-2">
        <Button
          class="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={$updatePagesMutation.isPending}
          onclick={addPage}
        >
          {#if !$updatePagesMutation.isPending}
            ➕ New Page
          {:else}
            Saving...
          {/if}
        </Button>
        <Button class="bg-green-600 hover:bg-green-700 text-white" onclick={addTextBlock}>
          📝 Add Text Box
        </Button>
        <Button class="bg-purple-600 hover:bg-purple-700 text-white" onclick={addImageBlock}>
          🖼️ Add Image
        </Button>
        {#if selectedElement}
          <Button class="bg-red-600 hover:bg-red-700 text-white" onclick={deleteSelectedElement}>
            🗑️ Delete Selected
          </Button>
        {/if}
      </div>
      <div class="flex gap-2">
        <Button
          class="flex-1 bg-gray-300 text-gray-800 hover:bg-gray-400"
          onclick={prevPage}
          disabled={currentPageIndex === 0}
        >
          ← Previous
        </Button>
        <Button
          class="flex-1 bg-gray-300 text-gray-800 hover:bg-gray-400"
          onclick={nextPage}
          disabled={currentPageIndex === $pages.length - 1}
        >
          Next →
        </Button>
      </div>
      <div class="flex flex-col gap-2 mt-4">
        <h3 class="text-lg font-semibold">Pages ({$pages.length})</h3>
        {#each $pages as page, i}
          <button
            class="py-2 px-4 rounded text-left transition flex items-center gap-2"
            class:bg-blue-100={i === currentPageIndex}
            class:bg-blue-500={i === currentPageIndex}
            class:text-white={i === currentPageIndex}
            class:hover:bg-blue-50={i !== currentPageIndex}
            onclick={() => (currentPageIndex = i)}
          >
            📄 Page {i + 1}
            <span class="text-xs opacity-70">({page.elements.length} items)</span>
          </button>
        {/each}
      </div>
    {:else}
      <div class="flex flex-col items-center gap-2 mt-4">
        <button
          class="py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600"
          onclick={() => (currentPageIndex = 0)}
        >
          <iconify-icon icon="mdi:file-document" width="24" height="24"></iconify-icon>
        </button>
        <button
          class="py-2 px-4 rounded bg-green-500 text-white hover:bg-green-600"
          onclick={addTextBlock}
        >
          <iconify-icon icon="mdi:text-box" width="24" height="24"></iconify-icon>
        </button>
        <button
          class="py-2 px-4 rounded bg-purple-500 text-white hover:bg-purple-600"
          onclick={addImageBlock}
        >
          <iconify-icon icon="mdi:image" width="24" height="24"></iconify-icon>
        </button>
        {#if selectedElement}
          <button
            class="py-2 px-4 rounded bg-red-500 text-white hover:bg-red-600"
            onclick={deleteSelectedElement}
          >
            <iconify-icon icon="mdi:delete" width="24" height="24"></iconify-icon>
          </button>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Canvas -->
  <div class="flex-1 p-4 overflow-auto">
    <div
      class="page relative mx-auto bg-white shadow-lg border-2 border-gray-200 select-none"
      onclick={handleCanvasClick}
    >
      {#each currentElements as element (element.id)}
        <div
          class="element-container absolute"
          class:selected={selectedElement === element.id}
          class:dragging={isDragging && selectedElement === element.id}
          style="left: {element.x}px; top: {element.y}px; width: {element.width}px; height: {element.height}px; z-index: {element.zIndex};"
          onmousedown={e => handleMouseDown(element.id, e)}
          onclick={e => handleElementClick(element.id, e)}
        >
          {#if element.type === 'text'}
            <div class="text-element h-full w-full">
              <textarea
                bind:value={element.content}
                placeholder="Type your text here..."
                class="w-full h-full resize-none border-none outline-none bg-transparent"
                style="font-size: {parseInt(element.style?.match(/font-size:(\d+)px/)?.[1] || '16')}px; font-family: Arial, sans-serif; padding: 4px;"
                oninput={e => handleTextChange(element.id, e.target.value)}
                ondblclick={e => handleTextDoubleClick(element.id, e)}
                onfocus={() => {isEditingText = true; selectedElement = element.id;}}
                onblur={() => {isEditingText = false;}}
              ></textarea>
            </div>
          {:else if element.type === 'image'}
            <div class="image-element h-full w-full overflow-hidden">
              <img
                src={element.src}
                alt="Presentation image"
                class="w-full h-full object-contain"
                draggable="false"
              />
            </div>
          {/if}

          <!-- Selection handles -->
          {#if selectedElement === element.id}
            <div class="selection-handles">
              <div
                class="handle handle-nw"
                onmousedown={e => handleResize(element.id, 'nw', e)}
              ></div>
              <div
                class="handle handle-ne"
                onmousedown={e => handleResize(element.id, 'ne', e)}
              ></div>
              <div
                class="handle handle-sw"
                onmousedown={e => handleResize(element.id, 'sw', e)}
              ></div>
              <div
                class="handle handle-se"
                onmousedown={e => handleResize(element.id, 'se', e)}
              ></div>
            </div>
          {/if}
        </div>
      {/each}

      <!-- Grid overlay for better positioning -->
      <div class="grid-overlay"></div>
    </div>
  </div>

  <!-- Properties Panel -->
  <div class={`bg-white shadow-md h-fit p-4 border-l transition-all duration-300 ${isPropertiesPanelMinimized ? 'w-16' : 'w-64'}`}>
    <div class="flex justify-between items-center">
      {#if !isPropertiesPanelMinimized}
        <h3 class="text-lg font-semibold">Properties</h3>
      {/if}
      <button onclick={togglePropertiesPanel} class="text-gray-600 hover:text-gray-900">
        <iconify-icon icon={isPropertiesPanelMinimized ? "mdi:chevron-right" : "mdi:chevron-left"} width="24" height="24"></iconify-icon>
      </button>
    </div>
    {#if !isPropertiesPanelMinimized}
      {#if selectedElement && selectedElementData}
        <div class="flex flex-col gap-4">
          <div class="text-sm font-medium text-gray-600 mb-2">
            {selectedElementData.type === 'text' ? '📝 Text Element' : '🖼️ Image Element'}
          </div>

          <div class="grid grid-cols-2 gap-2">
            <label class="flex flex-col">
              <span class="text-sm font-medium">Width:</span>
              <input
                type="number"
                class="border rounded p-2 text-sm"
                value={selectedElementData.width}
                oninput={e => updateElementProperty(selectedElement, 'width', parseInt(e.target.value) || 50)}
                min="50"
                max="800"
              />
            </label>
            <label class="flex flex-col">
              <span class="text-sm font-medium">Height:</span>
              <input
                type="number"
                class="border rounded p-2 text-sm"
                value={selectedElementData.height}
                oninput={e => updateElementProperty(selectedElement, 'height', parseInt(e.target.value) || 30)}
                min="30"
                max="600"
              />
            </label>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <label class="flex flex-col">
              <span class="text-sm font-medium">X Position:</span>
              <input
                type="number"
                class="border rounded p-2 text-sm"
                value={selectedElementData.x}
                oninput={e => updateElementProperty(selectedElement, 'x', parseInt(e.target.value) || 0)}
                min="0"
                max="750"
              />
            </label>
            <label class="flex flex-col">
              <span class="text-sm font-medium">Y Position:</span>
              <input
                type="number"
                class="border rounded p-2 text-sm"
                value={selectedElementData.y}
                oninput={e => updateElementProperty(selectedElement, 'y', parseInt(e.target.value) || 0)}
                min="0"
                max="570"
              />
            </label>
          </div>

          <label class="flex flex-col">
            <span class="text-sm font-medium">Layer (Z-Index):</span>
            <input
              type="number"
              class="border rounded p-2 text-sm"
              value={selectedElementData.zIndex}
              oninput={e => updateElementProperty(selectedElement, 'zIndex', parseInt(e.target.value) || 0)}
              min="0"
            />
          </label>

          {#if selectedElementData.type === 'text'}
            <label class="flex flex-col">
              <span class="text-sm font-medium">Font Size:</span>
              <input
                type="number"
                class="border rounded p-2 text-sm"
                value={parseInt(selectedElementData.style?.match(/font-size:(\d+)px/)?.[1] || '16')}
                oninput={e => {
                  const fontSize = parseInt(e.target.value) || 16;
                  updateElementProperty(selectedElement, 'style', `font-size:${fontSize}px; font-weight:normal;`);
                }}
                min="8"
                max="72"
              />
            </label>
          {/if}
        </div>
      {:else}
        <div class="text-gray-500 text-sm">
          Select an element to edit its properties
        </div>
      {/if}
    {:else}
      <div class="flex flex-col items-center gap-2 mt-4">
        <button
          class="py-2 px-4 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
          onclick={() => { /* Handle some action */ }}
        >
          <iconify-icon icon="mdi:settings" width="24" height="24"></iconify-icon>
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .page {
    position: relative;
    width: 800px;
    height: 600px;
    margin: 0 auto;
    background: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    overflow: visible;
  }

  .element-container {
    border: 2px solid transparent;
    transition: border-color 0.2s ease;
    cursor: move;
  }

  .element-container.selected {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }

  .element-container.dragging {
    opacity: 0.8;
    z-index: 1000 !important;
  }

  .text-element {
    background: transparent !important;
    border: none !important;
  }

  .text-element textarea {
    font-family: Arial, sans-serif;
    line-height: 1.4;
    color: #333;
    cursor: text;
  }

  .text-element textarea:focus {
    cursor: text;
  }

  .image-element {
    background: transparent !important;
    border: none !important;
  }

  .selection-handles {
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    pointer-events: none;
  }

  .handle {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #3b82f6;
    border: 2px solid white;
    border-radius: 50%;
    pointer-events: auto;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    z-index: 1001;
  }

  .handle-nw {
    top: 0;
    left: 0;
    cursor: nw-resize;
    transform: translate(-50%, -50%);
  }
  .handle-ne {
    top: 0;
    right: 0;
    cursor: ne-resize;
    transform: translate(50%, -50%);
  }
  .handle-sw {
    bottom: 0;
    left: 0;
    cursor: sw-resize;
    transform: translate(-50%, 50%);
  }
  .handle-se {
    bottom: 0;
    right: 0;
    cursor: se-resize;
    transform: translate(50%, 50%);
  }

  .grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.05;
    background-image:
      linear-gradient(to right, #000 1px, transparent 1px),
      linear-gradient(to bottom, #000 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
  }
</style>
