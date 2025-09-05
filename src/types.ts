/**
 * @author Arse09
 * @license MIT
 */

export type Prettify<T> = { [K in keyof T]: T[K] } & {};
