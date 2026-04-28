import { useEffect, useState } from "react";
import { fetchBooksWithCovers } from "./api/books";
import { BookCard } from "./components/BookCard";
import type { BookCardData } from "./types";
import "./App.css";

export default function App() {
  const [books, setBooks] = useState<BookCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBooks() {
      try {
        const data = await fetchBooksWithCovers();

        if (isMounted) {
          setBooks(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Произошла ошибка.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadBooks();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="app">
      <section className="app__intro">
        <h1>Список книг</h1>
        <p>Демо-приложение получает книги из API и отображает их карточками.</p>
      </section>

      {isLoading && <p className="app__status">Загрузка...</p>}
      {error && <p className="app__status app__status_error">{error}</p>}

      {!isLoading && !error && (
        <section className="book-grid">
          {books.map((book) => (
            <BookCard
              key={book.id}
              title={book.title}
              authors={book.authors}
              coverUrl={book.coverUrl}
            />
          ))}
        </section>
      )}
    </main>
  );
}
