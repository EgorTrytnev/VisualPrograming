import { describe, it, expect } from 'vitest';
import { csvToJSON } from "../csvToJSON.js";

describe('csvToJSON function', () => {
    it('Корректный ввод параметров', () => {
        const csvArray = ["name;age;city", "John;25;New York", "Jane;30;London"];
        const result = csvToJSON(csvArray, ';');
        expect(result).toEqual([
            { name: 'John', age: 25, city: 'New York' },
            { name: 'Jane', age: 30, city: 'London' }
        ]);
    });

    it('Передача неправильного массива', () => {
        expect(() => csvToJSON(["p1;p2;p3"], ';')).toThrowError('Некорректная передача');
    });

    it('Несовпадение параметров', () => {
        expect(() => csvToJSON(["p1;p2;p3", "1;A;b", "2;B"], ';')).toThrowError('Несовпадение по количеству параметров');
    });

    it('Передача пустого параметра', () => {
        expect(() => csvToJSON(["p1;p2;p3", "1;A;b", "2;B;"], ';')).toThrowError('Передача пустого значения');
    });
});