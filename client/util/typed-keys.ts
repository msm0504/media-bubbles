/*
  Needed to resolve Typescript errors when using Object.keys,
  since Object.keys always returns an array of type string[].
*/
export const keys = <T extends object>(obj: T): (keyof T)[] => Object.keys(obj) as (keyof T)[];
