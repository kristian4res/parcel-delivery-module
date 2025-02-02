export type QueryResult<T> = {
    status: number,
    message?: string,
    data?: T,
    error?: Error, 
}

export type WhereClause = {
    readonly field: string;
    readonly value: string;
};