export const keys = <T>(obj: T): (keyof T)[] => Object.keys(obj) as (keyof T)[];
