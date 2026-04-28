import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BookCard } from "./BookCard";
const URL_B = "https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg";

describe("BookCard", () => {
  it("рендерит название и авторов", () => {
    render(<BookCard title="Clean Code" authors={["Robert Martin"]} coverUrl={null} />);

    expect(screen.getByText("Clean Code")).toBeInTheDocument();
    expect(screen.getByText("Robert Martin")).toBeInTheDocument();
    expect(screen.getByText("Нет обложки")).toBeInTheDocument();
  });

  it("рендерит картинку", () => {
    render(
      <BookCard
        title="Refactoring"
        authors={["Martin Fowler"]}
        coverUrl={URL_B}
      />
    );

    expect(screen.getByRole("img", { name: "Обложка книги Refactoring" })).toHaveAttribute(
      "src",
      URL_B
    );
  });
});
