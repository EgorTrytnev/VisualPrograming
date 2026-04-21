import { describe, expect, expectTypeOf, it } from "vitest";
import {
    filterBy,
    groupBy,
    having,
    orderBy,
    paginate,
    query,
    sort,
    uniqueBy,
    where,
    type Group,
} from "./Conv";

type User = {
    id: number;
    name: string;
    surname: string;
    age: number;
    city: string;
};

const mockUsers: User[] = [
    { id: 1, name: "John", surname: "Doe", age: 30, city: "NY" },
    { id: 2, name: "Jane", surname: "Doe", age: 25, city: "NY" },
    { id: 3, name: "John", surname: "Smith", age: 40, city: "LA" },
    { id: 4, name: "Mike", surname: "Brown", age: 35, city: "LA" },
    { id: 5, name: "Anna", surname: "Smith", age: 28, city: "NY" },
];

describe("Query operations", () => {
    it("where filters rows by key and value", () => {
        const result = where("name", "John")(mockUsers);

        expect(result).toHaveLength(2);
        expect(result.every((user) => user.name === "John")).toBe(true);
    });

    it("sort orders rows in ascending and descending order", () => {
        expect(sort("age")(mockUsers).map((user) => user.age)).toEqual([25, 28, 30, 35, 40]);
        expect(sort("age", true)(mockUsers).map((user) => user.age)).toEqual([40, 35, 30, 28, 25]);
    });

    it("groupBy collects rows with the same key", () => {
        const result = groupBy("city")(mockUsers);

        expect(result).toHaveLength(2);
        expect(result.find((group) => group.key === "NY")?.items).toHaveLength(3);
        expect(result.find((group) => group.key === "LA")?.items).toHaveLength(2);
    });

    it("having filters grouped results", () => {
        const result = having((group: Group<User, "city">) => group.items.length > 2)(groupBy("city")(mockUsers));

        expect(result).toHaveLength(1);
        expect(result[0].key).toBe("NY");
    });

    it("query applies where, groupBy, having and sort in the required order", () => {
        const result = query(
            where("city", "NY"),
            groupBy("surname"),
            having((group: Group<User, "surname">) => group.items.length > 1),
            sort("key"),
        )(mockUsers);

        expect(result).toEqual([
            {
                key: "Doe",
                items: [
                    { id: 1, name: "John", surname: "Doe", age: 30, city: "NY" },
                    { id: 2, name: "Jane", surname: "Doe", age: 25, city: "NY" },
                ],
            },
        ]);
    });

    it("aliases and additional helpers keep working", () => {
        expect(filterBy("city", "NY")(mockUsers)).toEqual(where("city", "NY")(mockUsers));
        expect(orderBy("age", true)(mockUsers)).toEqual(sort("age", true)(mockUsers));
        expect(uniqueBy("name")(mockUsers).map((user) => user.name)).toEqual(["John", "Jane", "Mike", "Anna"]);
        expect(paginate(2, 2)(mockUsers).map((user) => user.id)).toEqual([3, 4]);
    });
});

describe("Type system", () => {
    it("infers the result type for row queries", () => {
        const result = query(where("city", "NY"), sort("age"))(mockUsers);

        expectTypeOf(result).toEqualTypeOf<User[]>();
    });

    it("infers the result type for grouped queries", () => {
        const result = query(
            groupBy("city"),
            having((group: Group<User, "city">) => group.items.length > 1),
            sort("key"),
        )(mockUsers);

        expectTypeOf(result).toEqualTypeOf<Group<User, "city">[]>();
    });

    it("rejects invalid operator order during type checking", () => {
        if (false) {
            // @ts-expect-error where cannot appear after groupBy
            query(groupBy("city"), where("city", "NY"));

            // @ts-expect-error having cannot be the first operator
            query(having((group: Group<User, "city">) => group.items.length > 0));

            // @ts-expect-error groupBy cannot appear after sort
            query(sort("age"), groupBy("city"));
        }

        expect(true).toBe(true);
    });

    it("rejects incompatible pipelines during type checking", () => {
        if (false) {
            // @ts-expect-error grouped rows can no longer be sorted by age
            query(groupBy("city"), sort("age"))(mockUsers);

            // @ts-expect-error string value is incompatible with numeric age
            query(where("age", "30"))(mockUsers);
        }

        expect(true).toBe(true);
    });
});
