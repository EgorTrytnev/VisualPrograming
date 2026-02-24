import { describe, it, expect } from 'vitest';

import {
  generatePerson,
  createPublication,
  computeSpace,
  fetchStateColor,
  capitalizeFirst,
  eliminateSpaces,
  retrieveFirstItem,
  locateById
} from './lab_1';


// ---------- generatePerson ----------

describe('generatePerson', () => {
  it('создаёт человека со всеми полями', () => {
    const person = generatePerson(1, 'Егор', 'test@mail.com');

    expect(person).toEqual({
      id: 1,
      name: 'Егор',
      email: 'test@mail.com',
      isActive: true
    });
  });

  it('создаёт человека без email', () => {
    const person = generatePerson(2, 'Анна');

    expect(person.email).toBeUndefined();
    expect(person.isActive).toBe(true);
  });
});


// ---------- createPublication ----------

describe('createPublication', () => {
  it('возвращает переданный объект', () => {
    const publication = {
      title: 'Совершенный код',
      author: 'Макконел',
      category: 'non-fiction' as const,
      year: 2004
    };

    expect(createPublication(publication)).toStrictEqual(publication);
  });
});


// ---------- computeSpace ----------

describe('computeSpace', () => {
  it('считает площадь круга', () => {
    const area = computeSpace('circle', { radius: 10 });
    expect(area).toBeCloseTo(314, 1);
  });

  it('считает площадь квадрата', () => {
    const area = computeSpace('square', { side: 5 });
    expect(area).toBe(25);
  });

  it('возвращает 0 при нулевых значениях', () => {
    expect(computeSpace('circle', { radius: 0 })).toBe(0);
  });
});


// ---------- fetchStateColor ----------

describe('fetchStateColor', () => {
  it('active -> green', () => {
    expect(fetchStateColor('active')).toBe('green');
  });

  it('inactive -> gray', () => {
    expect(fetchStateColor('inactive')).toBe('gray');
  });

  it('new -> yellow', () => {
    expect(fetchStateColor('new')).toBe('yellow');
  });

  it('deleted -> red', () => {
    expect(fetchStateColor('deleted')).toBe('red');
  });
});


// ---------- capitalizeFirst ----------

describe('capitalizeFirst', () => {
  it('делает первую букву заглавной', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
  });

  it('делает всю строку uppercase', () => {
    expect(capitalizeFirst('hello world', true)).toBe('HELLO WORLD');
  });

  it('пустая строка', () => {
    expect(capitalizeFirst('')).toBe('');
  });
});


// ---------- eliminateSpaces ----------

describe('eliminateSpaces', () => {
  it('убирает пробелы по краям', () => {
    expect(eliminateSpaces('   test   ')).toBe('test');
  });

  it('uppercase после trim', () => {
    expect(eliminateSpaces('   test   ', true)).toBe('TEST');
  });

  it('пустая строка', () => {
    expect(eliminateSpaces('')).toBe('');
  });
});


// ---------- retrieveFirstItem ----------

describe('retrieveFirstItem', () => {
  it('возвращает первый элемент', () => {
    expect(retrieveFirstItem([10, 20, 30])).toBe(10);
  });

  it('возвращает undefined для пустого массива', () => {
    expect(retrieveFirstItem([])).toBeUndefined();
  });
});


// ---------- locateById ----------

describe('locateById', () => {
  const users = [
    { id: 1, name: 'Даша' },
    { id: 2, name: 'Егор' },
    { id: 3, name: 'Яся' }
  ];

  it('находит элемент по id', () => {
    const result = locateById(users, 2);
    expect(result?.name).toBe('Егор');
  });

  it('возвращает undefined если id нет', () => {
    expect(locateById(users, 99)).toBeUndefined();
  });
});