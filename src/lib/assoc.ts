import iassign from 'immutable-assign';

export const assoc: <S, P>(
  s: S,
  get: (s: S) => P,
  set: (p: Readonly<P>) => P
) => S = (s, get, set) => {
  return iassign(s, get, set);
};

export const dissoc: <S, P extends { [key: string]: any }>(
  s: S,
  get: (s: S) => P,
  key: string
) => S = (s, get, key) => {
  return assoc(s, get, p => {
    const { [key]: _, ...butKey } = p;
    return butKey as typeof p;
  });
};
