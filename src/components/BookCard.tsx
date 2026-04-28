import "./BookCard.css";

interface BookCardProps {
  title: string;
  authors: string[];
  coverUrl: string | null;
}

export function BookCard({ title, authors, coverUrl }: BookCardProps) {
  return (
    <article className="book-card">
      {coverUrl ? (
        <img className="book-card__cover" src={coverUrl} alt={`Обложка книги ${title}`} />
      ) : (
        <div className="book-card__placeholder">Нет обложки</div>
      )}
      <h2 className="book-card__title">{title}</h2>
      <p className="book-card__authors">{authors.join(", ")}</p>
    </article>
  );
}
