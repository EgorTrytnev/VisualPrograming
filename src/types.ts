export interface ApiBook {
  id: number;
  title: string;
  isbn: string;
  pageCount: number;
  authors: string[];
}

export interface BookCardData extends ApiBook {
  coverUrl: string | null;
}
