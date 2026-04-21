type Comparable = string | number | bigint | boolean | Date;
type QueryStage = "where" | "groupBy" | "having" | "sort";
type QueryStageOrStart = QueryStage | "start";
type GroupLike = { key: unknown; items: unknown[] };

type OperationMetadata<Kind extends QueryStage> = {
    readonly kind: Kind;
};

function createOperation<Fn extends (...args: never[]) => unknown, Meta extends object>(
    fn: Fn,
    meta: Meta,
): Fn & Meta {
    return Object.assign(fn, meta);
}

export type Transform<T> = (data: T[]) => T[];

export type Group<T, K extends keyof T> = {
    key: T[K];
    items: T[];
};

export type WhereOperation<Key extends PropertyKey, Value> = (<Item extends Record<Key, Value>>(data: Item[]) => Item[]) &
    OperationMetadata<"where"> & {
        readonly key: Key;
        readonly value: Value;
    };

export type GroupByOperation<Key extends PropertyKey> = (<Item extends Record<Key, unknown>>(
    data: Item[],
) => Group<Item, Extract<Key, keyof Item>>[]) &
    OperationMetadata<"groupBy"> & {
        readonly key: Key;
    };

export type HavingOperation<GroupItem extends GroupLike = GroupLike> = ((data: GroupItem[]) => GroupItem[]) &
    OperationMetadata<"having"> & {
        readonly predicate: (group: GroupItem) => boolean;
    };

export type SortOperation<Key extends PropertyKey> = (<Item extends Record<Key, Comparable>>(data: Item[]) => Item[]) &
    OperationMetadata<"sort"> & {
        readonly key: Key;
        readonly desc: boolean;
    };

export type Filter<T> = <K extends keyof T>(key: K, value: T[K]) => WhereOperation<K, T[K]>;
export type Grouper<T> = <K extends keyof T>(key: K) => GroupByOperation<K>;
export type GroupFilter<T extends GroupLike = GroupLike> = (predicate: (group: T) => boolean) => HavingOperation<T>;
export type Sorter<T> = <K extends keyof T>(key: K, desc?: boolean) => SortOperation<K>;
export type Unique<T> = <K extends keyof T>(key: K) => Transform<T>;
export type Paginate<T> = (page: number, pageSize: number) => Transform<T>;

export function where<Key extends PropertyKey, Value>(key: Key, value: Value): WhereOperation<Key, Value> {
    return createOperation(
        <Item extends Record<Key, Value>>(data: Item[]) => data.filter((item) => item[key] === value),
        { kind: "where" as const, key, value },
    ) as WhereOperation<Key, Value>;
}

export function groupBy<Key extends PropertyKey>(key: Key): GroupByOperation<Key> {
    return createOperation(
        <Item extends Record<Key, unknown>>(data: Item[]) => {
            const groups = new Map<Item[Key], Group<Item, Extract<Key, keyof Item>>>();

            for (const item of data) {
                const groupKey = item[key];
                const existingGroup = groups.get(groupKey);

                if (existingGroup) {
                    existingGroup.items.push(item);
                    continue;
                }

                groups.set(groupKey, {
                    key: groupKey,
                    items: [item],
                } as Group<Item, Extract<Key, keyof Item>>);
            }

            return Array.from(groups.values());
        },
        { kind: "groupBy" as const, key },
    ) as GroupByOperation<Key>;
}

export function having<GroupItem extends GroupLike>(
    predicate: (group: GroupItem) => boolean,
): HavingOperation<GroupItem> {
    return createOperation(
        (groups: GroupItem[]) => groups.filter(predicate),
        { kind: "having" as const, predicate },
    ) as HavingOperation<GroupItem>;
}

export function sort<Key extends PropertyKey>(key: Key, desc = false): SortOperation<Key> {
    return createOperation(
        <Item extends Record<Key, Comparable>>(data: Item[]) =>
            [...data].sort((leftItem, rightItem) => {
                const left = leftItem[key];
                const right = rightItem[key];

                if (left < right) {
                    return desc ? 1 : -1;
                }

                if (left > right) {
                    return desc ? -1 : 1;
                }

                return 0;
            }),
        { kind: "sort" as const, key, desc },
    ) as SortOperation<Key>;
}

export const filterBy = where;
export const orderBy = sort;

export function uniqueBy<Key extends PropertyKey>(key: Key) {
    return <Item extends Record<Key, unknown>>(data: Item[]) => {
        const seen = new Set<Item[Key]>();

        return data.filter((item) => {
            const value = item[key];

            if (seen.has(value)) {
                return false;
            }

            seen.add(value);
            return true;
        });
    };
}

export function paginate(page: number, pageSize: number) {
    return <Item>(data: Item[]) => {
        const start = (page - 1) * pageSize;
        return data.slice(start, start + pageSize);
    };
}

export type QueryOperation = ((data: any) => any) & OperationMetadata<QueryStage>;

type OperationKind<Operation> = Operation extends OperationMetadata<infer Kind> ? Kind : never;

type AllowedNextKinds<Stage extends QueryStageOrStart> =
    Stage extends "start" | "where"
        ? "where" | "groupBy" | "sort"
        : Stage extends "groupBy"
          ? "groupBy" | "having" | "sort"
          : Stage extends "having"
            ? "having" | "sort"
            : "sort";

type ValidateOrder<
    Steps extends readonly QueryOperation[],
    Stage extends QueryStageOrStart = "start",
> = Steps extends readonly [infer First, ...infer Rest]
    ? First extends QueryOperation
        ? OperationKind<First> extends AllowedNextKinds<Stage>
            ? readonly [
                  First,
                  ...ValidateOrder<Extract<Rest, readonly QueryOperation[]>, OperationKind<First>>,
              ]
            : never
        : never
    : Steps;

type ApplyWhere<Current, Key extends PropertyKey, Value> = Current extends Array<infer Item>
    ? Key extends keyof Item
        ? Value extends Item[Key]
            ? Item[]
            : never
        : never
    : never;

type ApplyGroupBy<Current, Key extends PropertyKey> = Current extends Array<infer Item>
    ? Key extends keyof Item
        ? Group<Item, Key>[]
        : never
    : never;

type ApplyHaving<Current, GroupItem extends GroupLike> = Current extends Array<infer Item>
    ? Item extends GroupLike
        ? Item extends GroupItem
            ? Item[]
            : never
        : never
    : never;

type ApplySort<Current, Key extends PropertyKey> = Current extends Array<infer Item>
    ? Key extends keyof Item
        ? Item[Key] extends Comparable
            ? Item[]
            : never
        : never
    : never;

type ApplyOperation<Current, Operation extends QueryOperation> = Operation extends WhereOperation<infer Key, infer Value>
    ? ApplyWhere<Current, Key, Value>
    : Operation extends GroupByOperation<infer Key>
      ? ApplyGroupBy<Current, Key>
      : Operation extends HavingOperation<infer GroupItem>
        ? ApplyHaving<Current, GroupItem>
        : Operation extends SortOperation<infer Key>
          ? ApplySort<Current, Key>
          : never;

type ApplyOperations<Current, Steps extends readonly QueryOperation[]> = Steps extends readonly [
    infer First,
    ...infer Rest,
]
    ? First extends QueryOperation
        ? ApplyOperations<ApplyOperation<Current, First>, Extract<Rest, readonly QueryOperation[]>>
        : never
    : Current;

type QueryInput<Item, Steps extends readonly QueryOperation[]> = ApplyOperations<Item[], Steps> extends never
    ? never
    : Item[];

type QueryResult<Item, Steps extends readonly QueryOperation[]> = ApplyOperations<Item[], Steps>;

export function query<const Steps extends readonly QueryOperation[]>(
    ...steps: ValidateOrder<Steps> extends never ? never : Steps
) {
    return function run<Item>(initialData: QueryInput<Item, Steps>): QueryResult<Item, Steps> {
        return steps.reduce<unknown>(
            (data, step) => (step as (input: unknown) => unknown)(data),
            initialData as unknown,
        ) as QueryResult<Item, Steps>;
    };
}
