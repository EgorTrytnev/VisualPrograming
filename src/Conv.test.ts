import { it, describe, expect } from 'vitest';
import { 
    filterBy, orderBy, groupBy, having, uniqueBy, paginate, query 
} from './Conv';

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

describe('Data Query', () => {
    console.log('Исходные данные:', JSON.stringify(mockUsers, null, 2));

    describe('Basic Operations', () => {
        
        it('filterBy: filters by key and value', () => {
            const result = filterBy("name", "John")(mockUsers);
            console.log('filterBy("name", "John"):', JSON.stringify(result, null, 2));
            expect(result).toHaveLength(2);
            expect(result.every(u => u.name === "John")).toBe(true);
        });

        it('orderBy: sorts ascending by default', () => {
            const result = orderBy("age")(mockUsers);
            console.log('orderBy("age"):', JSON.stringify(result.map(u => ({id: u.id, age: u.age})), null, 2));
            expect(result.map(u => u.age)).toEqual([25, 28, 30, 35, 40]);
        });

        it('orderBy: sorts descending when specified', () => {
            const result = orderBy("age", true)(mockUsers);
            console.log('orderBy("age", true):', JSON.stringify(result.map(u => ({id: u.id, age: u.age})), null, 2));
            expect(result.map(u => u.age)).toEqual([40, 35, 30, 28, 25]);
        });

        it('groupBy: groups by key', () => {
            const result = groupBy("city")(mockUsers);
            console.log('groupBy("city"):', JSON.stringify(result, null, 2));
            expect(result).toHaveLength(2);
            expect(result.find(g => g.key === "NY")?.items).toHaveLength(3);
            expect(result.find(g => g.key === "LA")?.items).toHaveLength(2);
        });

        it('having: filters groups', () => {
            const groups = groupBy("city")(mockUsers);
            const result = having(g => g.items.length > 2)(groups);
            console.log('having(groups, g => g.items.length > 2):', JSON.stringify(result, null, 2));
            expect(result).toHaveLength(1);
            expect(result[0].key).toBe("NY");
        });

        it('uniqueBy: removes duplicates', () => {
            const result = uniqueBy("name")(mockUsers);
            console.log('uniqueBy("name"):', JSON.stringify(result, null, 2));
            expect(result).toHaveLength(4);
            expect(result.filter(u => u.name === "John")).toHaveLength(1);
        });

        it('paginate: returns page of results', () => {
            const result = paginate(2, 2)(mockUsers);
            console.log('paginate(2, 2):', JSON.stringify(result, null, 2));
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe(3);
            expect(result[1].id).toBe(4);
        });
    });

    describe('Query Function', () => {
        it('combines multiple steps', () => {
            const pipeline = query(
                filterBy("surname", "Doe"),
                orderBy("age")
            );
            const result = pipeline(mockUsers);
            console.log('query(filterBy("surname", "Doe"), orderBy("age")):', JSON.stringify(result, null, 2));
            expect(result).toHaveLength(2);
            expect(result[0].name).toBe("Jane");
            expect(result[1].name).toBe("John");
        });

        it('handles empty results', () => {
            const pipeline = query(
                filterBy("name", "NonExistent")
            );
            const result = pipeline(mockUsers);
            console.log('empty results:', JSON.stringify(result, null, 2));
            expect(result).toEqual([]);
        });

        it('chains pagination with filters', () => {
            const pipeline = query(
                filterBy("city", "NY"),
                orderBy("age", true),
                paginate(1, 2)
            );
            const result = pipeline(mockUsers);
            console.log('pagination with filters:', JSON.stringify(result, null, 2));
            expect(result).toHaveLength(2);
            expect(result[0].age).toBe(30);
            expect(result[1].age).toBe(28);
        });
    });
});
