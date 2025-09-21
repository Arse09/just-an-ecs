/**
 * @author Arse09
 * @license MIT (LICENSE)
 */

export type Prettify<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
export type PrettifyUnion<T> = T extends unknown ? { [K in keyof T]: T[K] } : never;
