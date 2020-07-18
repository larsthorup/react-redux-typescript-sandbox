import * as assert from 'assert';
import iassign from 'immutable-assign';

/*
 * Return a copy of `s`, where the branch returned by `get`
 * is replaced with the branch returned by `set`
 * with maximum sharing between `s` and the result
 * @param get branch accessor (use `.prop` or `[index]`)
 * @param set can immutably modify the passed in branch (`(_) => ({..._})`)
 * @param s the object to copy
 */
export const assoc: <S, P>(
  get: (s: S) => P,
  set: (p: Readonly<P>) => P,
  s: S
) => S = (get, set, s) => {
  return iassign(s, get, set);
};

// class Assoc<S, P> {
//   private s: S;
//   private selector?: (s: S) => P;
//   constructor(s: S) {
//     this.s = s;
//   }
//   set(selector: (s: S) => P): Assoc<S, P> {
//     this.selector = selector;
//     return this;
//   }
//   to(creator: (p: Readonly<P>) => P): S {
//     return assoc(this.selector!, creator, this.s);
//   }
// }

class Assoc<S, P> {
  private selector: (s: S) => P;
  private creator?: (p: Readonly<P>) => P;
  constructor(selector: (s: S) => P) {
    this.selector = selector;
  }
  to(creator: (p: Readonly<P>) => P): Assoc<S, P> {
    this.creator = creator;
    return this;
  }
  in(s: S): S {
    assert.ok(this.creator);
    return assoc(this.selector, this.creator!, s);
  }
}

export const update: <S, P>(
  selector: (s: S) => P
) => Assoc<S, P> = selector => {
  return new Assoc(selector);
};

/*
 * Return a copy of `s`,
 * where the dict returned by `get` has `key` removed
 * with maximum sharing between `s` and the result
 * @param get branch accessor (use `.prop` or `[index]`)
 * @param key the item to remove
 * @param s the object to copy
 */
export const dissoc: <S, P extends { [key: string]: any }>(
  get: (s: S) => P,
  key: string,
  s: S
) => S = (get, key, s) => {
  return assoc(
    get,
    p => {
      const { [key]: _, ...butKey } = p;
      return butKey as typeof p;
    },
    s
  );
};

/*
 * Return a copy of `s`
 * where the dict returned by `get` has `value` added at `key`
 * unless `key`already exists
 * with maximum sharing between `s` and the result
 * @param get branch accessor (use `.prop` or `[index]`)
 * @param value the value to add
 * @param key the item to touch
 * @param s the object to copy
 */
export const touch: <S, V, P extends { [key: string]: V }>(
  get: (s: S) => P,
  value: V,
  key: string,
  s: S
) => S = (get, value, key, s) => {
  if (get(s)[key]) {
    return s;
  } else {
    return assoc(get, _ => ({ ..._, [key]: value }), s);
  }
};
