import type { ApiBook, BookCardData } from "../types";

const BOOKS_API_URL = "https://fakeapi.extendsclass.com/books";
const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";

interface GoogleBooksResponse {
  items?: Array<{
    volumeInfo?: {
      imageLinks?: {
        smallThumbnail?: string;
        thumbnail?: string;
      };
    };
  }>;
}

export async function fetchBooks(): Promise<ApiBook[]> {
  const response = await fetch(BOOKS_API_URL);

  if (!response.ok) {
    throw new Error("Не удалось загрузить список книг.");
  }

  return response.json() as Promise<ApiBook[]>;
}

export async function fetchBookCoverUrl(isbn: string): Promise<string | null> {
  const searchResponse = await fetch(
    `${GOOGLE_BOOKS_API_URL}?q=isbn:${encodeURIComponent(isbn)}`
  );

  if (searchResponse.ok) {
    const data = (await searchResponse.json()) as GoogleBooksResponse;
    const imageLinks = data.items?.[0]?.volumeInfo?.imageLinks;
    const thumbnail = imageLinks?.thumbnail ?? imageLinks?.smallThumbnail;

    if (thumbnail) {
      return thumbnail.replace("http://", "https://");
    }
  }

  return null;
}

export async function fetchBooksWithCovers(): Promise<BookCardData[]> {
  const books = await fetchBooks();

  return Promise.all(
    books.map(async (book) => ({
      ...book,
      coverUrl: await fetchBookCoverUrl(book.isbn)
    }))
  );
}
