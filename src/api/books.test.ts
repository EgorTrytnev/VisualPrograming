import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchBookCoverUrl, fetchBooks, fetchBooksWithCovers } from "./books";

const URL_B = "https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg";

describe("books api", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Проверка загрузки", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify([{ id: 1, title: "Test", isbn: "123", pageCount: 100, authors: ["A"] }]),
        { status: 200 }
      )
    );

    const books = await fetchBooks();

    expect(fetchMock).toHaveBeenCalledWith("https://fakeapi.extendsclass.com/books");
    expect(books).toHaveLength(1);
    expect(books[0].title).toBe("Test");
  });

  it("null если обложка не найдена", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ items: [] }), { status: 200 })
    );

    const coverUrl = await fetchBookCoverUrl("123");

    expect(coverUrl).toBeNull();
  });

  it("совмещает описание с обложкой", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([{ id: 1, title: "Test", isbn: "123", pageCount: 100, authors: ["A"] }]),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            items: [{ volumeInfo: { imageLinks: { thumbnail: URL_B } } }]
          }),
          { status: 200 }
        )
      );

    const books = await fetchBooksWithCovers();

    expect(books).toHaveLength(1);
    expect(books[0].coverUrl).toBe(URL_B);
  });
});
