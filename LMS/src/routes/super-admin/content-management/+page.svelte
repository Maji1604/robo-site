<script lang="ts">
    import BookCreator from '$lib/components/pages/contentManagement/bookCreator.svelte';
  
    let books = [
      { id: 1, title: 'Math Grade 1', author: 'John Doe', grade: '1' },
      { id: 2, title: 'Science Grade 2', author: 'Jane Smith', grade: '2' }
    ];
  
    let activeTab: 'list' | 'create' | 'view' = 'list';
    let currentBook = { id: null as number | null, title: '', author: '', grade: '' };
  
    function setActiveTab(tab: 'list' | 'create' | 'view') {
      activeTab = tab;
    }
  
    function editBook(book: { id: number | null; title: string; author: string; grade: string }) {
      currentBook = { ...book };
      activeTab = 'create';
    }
  
    function viewBook(book: { id: number | null; title: string; author: string; grade: string }) {
      currentBook = { ...book };
      activeTab = 'view';
    }
  
    function saveBook(book: { id: number | null; title: string; author: string; grade: string }) {
      if (book.id) {
        books = books.map(b => (b.id === book.id ? book : b));
      } else {
        book.id = books.length + 1;
        books = [...books, book];
      }
      activeTab = 'list';
      currentBook = { id: null, title: '', author: '', grade: '' };
    }
  </script>
  
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Tabs -->
    <div class="mb-6 flex space-x-2 bg-gray-200 w-fit p-1 rounded-lg shadow-lg border " role="tablist">
      <button
        onclick={() => setActiveTab('list')}
        class="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        class:bg-indigo-600={activeTab === 'list'}
        class:text-white={activeTab === 'list'}
        class:bg-gray-200={activeTab !== 'list'}
        class:text-gray-700={activeTab !== 'list'}
        class:hover:bg-indigo-700={activeTab === 'list'}
        class:hover:bg-gray-300={activeTab !== 'list'}
        role="tab"
        aria-selected={activeTab === 'list'}
        aria-controls="list-panel"
      >
        Book List
      </button>
      <button
        onclick={() => {
          setActiveTab('create');
          currentBook = { id: null, title: '', author: '', grade: '' };
        }}
        class="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        class:bg-indigo-600={activeTab === 'create'}
        class:text-white={activeTab === 'create'}
        class:bg-gray-200={activeTab !== 'create'}
        class:text-gray-700={activeTab !== 'create'}
        class:hover:bg-indigo-700={activeTab === 'create'}
        class:hover:bg-gray-300={activeTab !== 'create'}
        role="tab"
        aria-selected={activeTab === 'create'}
        aria-controls="create-panel"
      >
        Create Book
      </button>
    </div>
  
    <!-- Tab Panels -->
    {#if activeTab === 'list'}
      <div id="list-panel" role="tabpanel" aria-labelledby="list-tab">
        {#if books.length === 0}
          <p class="text-gray-500 text-lg">No books available.</p>
        {:else}
          <!-- Table for Desktop -->
          <div class="hidden md:block overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Author
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Grade
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                {#each books as book (book.id)}
                  <tr class="hover:bg-gray-50 transition-colors duration-200">
                    <td class="px-6 py-4 text-sm text-gray-600">{book.id}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{book.title}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{book.author}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{book.grade}</td>
                    <td class="px-6 py-4 text-sm font-medium space-x-2">
                      <button
                        onclick={() => editBook(book)}
                        class="text-indigo-600 hover:text-indigo-800 focus:outline-none focus:underline transition-colors duration-200"
                        aria-label={`Edit ${book.title}`}
                      >
                        Edit
                      </button>
                      <button
                        onclick={() => viewBook(book)}
                        class="text-indigo-600 hover:text-indigo-800 focus:outline-none focus:underline transition-colors duration-200"
                        aria-label={`View ${book.title}`}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          <!-- Cards for Mobile -->
          <div class="md:hidden space-y-4">
            {#each books as book (book.id)}
              <div
                class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div class="space-y-2">
                  <p class="text-sm text-gray-600"><strong>ID:</strong> {book.id}</p>
                  <p class="text-sm text-gray-600"><strong>Title:</strong> {book.title}</p>
                  <p class="text-sm text-gray-600"><strong>Author:</strong> {book.author}</p>
                  <p class="text-sm text-gray-600"><strong>Grade:</strong> {book.grade}</p>
                </div>
                <div class="mt-3 flex space-x-2">
                  <button
                    onclick={() => editBook(book)}
                    class="text-indigo-600 hover:text-indigo-800 text-sm font-medium focus:outline-none focus:underline transition-colors duration-200"
                    aria-label={`Edit ${book.title}`}
                  >
                    Edit
                  </button>
                  <button
                    onclick={() => viewBook(book)}
                    class="text-indigo-600 hover:text-indigo-800 text-sm font-medium focus:outline-none focus:underline transition-colors duration-200"
                    aria-label={`View ${book.title}`}
                  >
                    View
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {:else if activeTab === 'create'}
      <div id="create-panel" role="tabpanel" aria-labelledby="create-tab">
        <BookCreator {books} on:save={e => saveBook(e.detail)} />
      </div>
    {:else if activeTab === 'view'}
      <div
        id="view-panel"
        role="tabpanel"
        aria-labelledby="view-tab"
        class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm max-w-md mx-auto"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-4">View Book</h2>
        <div class="space-y-3">
          <p class="text-gray-600"><strong>Title:</strong> {currentBook.title}</p>
          <p class="text-gray-600"><strong>Author:</strong> {currentBook.author}</p>
          <p class="text-gray-600"><strong>Grade:</strong> {currentBook.grade}</p>
        </div>
        <button
          onclick={() => setActiveTab('list')}
          class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Back to List
        </button>
      </div>
    {/if}
  </div>