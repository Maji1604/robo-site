import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

export const books = writable([
  {
    id: uuidv4(),
    title: 'Sample Book',
    pages: [
      {
        id: uuidv4(),
        elements: [
          { id: uuidv4(), type: 'text', content: 'Welcome to my book!', x: 50, y: 50 },
          { id: uuidv4(), type: 'image', src: 'https://via.placeholder.com/150', x: 200, y: 100 }
        ]
      }
    ]
  }
]);

/**
 * @param {any} title
 */
export function addBook(title) {
  books.update(currentBooks => [
    ...currentBooks,
    { id: uuidv4(), title, pages: [{ id: uuidv4(), elements: [] }] }
  ]);
}

/**
 * @param {any} bookId
 */
export function addPage(bookId) {
  books.update(currentBooks => {
    const book = currentBooks.find(b => b.id === bookId);
    if (book) {
      book.pages.push({ id: uuidv4(), elements: [] });
    }
    return [...currentBooks];
  });
}

/**
 * @param {any} bookId
 * @param {any} pageId
 * @param {{ id: any; type: string; content: string; x: number; y: number; src?: undefined; } | { id: any; type: string; src: string; x: number; y: number; content?: undefined; }} element
 */
export function addElement(bookId, pageId, element) {
  books.update(currentBooks => {
    const book = currentBooks.find(b => b.id === bookId);
    if (book) {
      const page = book.pages.find(p => p.id === pageId);
      if (page) {
        page.elements.push({ id: uuidv4(), ...element });
      }
    }
    return [...currentBooks];
  });
}