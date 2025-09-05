/**
 * @original Arse09
 * @license MIT (LICENSE.md)
 */

export type Prettify<T> = { [K in keyof T]: T[K] } & {};
