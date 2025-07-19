<script>
    import { books } from '../stores/bookStore';
    import { goto } from '$app/navigation';
  
    export let currentPage = 1;
    const itemsPerPage = 5;
  
    $: paginatedBooks = $books.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    $: totalPages = Math.ceil($books.length / itemsPerPage);
  
    function goToPage(page) {
      if (page >= 1 && page <= totalPages) {
        currentPage = page;
      }
    }
  
    function editBook(bookId) {
      goto(`/book/${bookId}`);
    }
  </script>
  
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Book List</h2>
    {#if paginatedBooks.length === 0}
      <p>No books available.</p>
    {:else}
      <ul class="space-y-2">
        {#each paginatedBooks as book}
          <li class="p-2 border rounded flex justify-between items-center">
            <span>{book.title}</span>
            <button
              on:click={() => editBook(book.id)}
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
          </li>
        {/each}
      </ul>
      <div class="mt-4 flex justify-center space-x-2">
        <button
          on:click={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          class="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          on:click={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          class="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    {/if}
  </div>