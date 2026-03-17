export type Transform<T> = (data: T[]) => T[];

export type Filter<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;

export const filterBy: Filter<any> = (key, value) => (data) => 
    data.filter(item => item[key] === value);

export type Sorter<T> = <K extends keyof T>(key: K, desc?: boolean) => Transform<T>;

export const orderBy: Sorter<any> = (key, desc = false) => (data) => 
    [...data].sort((a, b) => {
        if (a[key] < b[key]) return desc ? 1 : -1;
        if (a[key] > b[key]) return desc ? -1 : 1;
        return 0;
    });

export type Group<T, K extends keyof T> = {
    key: T[K];
    items: T[];
};

export type Grouper<T> = <K extends keyof T>(key: K) => (data: T[]) => Group<T, K>[];

export const groupBy: Grouper<any> = (key) => (data) => {
    const map = new Map();
    data.forEach(item => {
        const val = item[key];
        if (!map.has(val)) {
            map.set(val, { key: val, items: [] });
        }
        map.get(val).items.push(item);
    });
    return Array.from(map.values());
};

export type GroupFilter<T, K extends keyof T> = (predicate: (group: Group<T, K>) => boolean) => (groups: Group<T, K>[]) => Group<T, K>[];

export const having: GroupFilter<any, any> = (predicate) => (groups) => 
    groups.filter(predicate);

export type Unique<T> = <K extends keyof T>(key: K) => Transform<T>;

export const uniqueBy: Unique<any> = (key) => (data) => {
    const seen = new Set();
    return data.filter(item => {
        const val = item[key];
        if (seen.has(val)) return false;
        seen.add(val);
        return true;
    });
};

export type Paginate<T> = (page: number, pageSize: number) => Transform<T>;

export const paginate: Paginate<any> = (page, pageSize) => (data) => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
};

export function query<T>(...steps: Array<(data: T[]) => any>) {
    return (initialData: T[]): any => {
        return steps.reduce((data, step) => step(data), initialData);
    };
}