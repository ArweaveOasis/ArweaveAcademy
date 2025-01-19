/**
 * Expands types for IntelliSense so they are more human readable
 * See https://stackoverflow.com/a/69288824
 */
export type Expand<T> = T extends (...args: infer A) => infer R
  ? (...args: Expand<A>) => Expand<R>
  : T extends infer O
  ? { [K in keyof O]: O[K] }
  : never;

/**
 * Same as TypeScript's Pick, but will distribute the Pick over unions
 */
export type DistributivePick<T, K extends keyof T> = T extends unknown
  ? Pick<T, K>
  : never;

/**
 * Overwrite a type with properties from another type
 */
export type Overwrite<T, U extends Partial<T>> = Pick<
  T,
  Exclude<keyof T, keyof U>
> &
  U;

/**
 * Same as Overwrite, but will distribute the Overwrite over unions
 */
export type DistributiveOverwrite<T, K> = T extends unknown
  ? Overwrite<T, K>
  : never;

/**
 * Mark certain keys as prohibited
 */
export type NeverAllow<T, K extends keyof T> = {
  // eslint-disable-next-line no-unused-vars
  [P in K]?: never;
};

/**
 * Rename a specific property of a type to another name
 *
 * Usage: RenameProperty\<\{ a: string \}, 'a', 'b'\>
 * -\> \{ b: string \}
 */
export type RenameProperty<T, K extends keyof T, R extends PropertyKey> = {
  [P in keyof T as P extends K ? R : P]: T[P];
};

/**
 * Rename multiple properties of one type to another name
 *
 * Usage: RenameProperties\<\{ a: string, b: number \}, \{ a: 'c', b: 'd' \}\>
 * -\> \{ c: string, d: number \}
 */
export type RenameProperties<
  T,
  R extends {
    [K in keyof R]: K extends keyof T ? PropertyKey : 'Error: key not in T';
  }
> = { [P in keyof T as P extends keyof R ? R[P] : P]: T[P] };
