import * as R from 'ramda';
import produce from 'immer';
import iassign from 'immutable-assign';
import { assoc, dissoc } from './assoc';

type State = {
  chat: {
    contact: {
      [key: string]: { id: string; name: string };
    };
  };
};

describe('syntax', () => {
  test('assoc', () => {
    const state: State = {
      chat: {
        contact: {
          '1': { id: '1', name: 'Lars' },
          '2': { id: '2', name: 'Kristian' }
        }
      }
    };
    const expected: State = {
      chat: {
        contact: {
          '1': { id: '1', name: 'Andrea' },
          '2': { id: '2', name: 'Kristian' }
        }
      }
    };

    // typescript, duplicated identifiers
    const newStateT = {
      ...state,
      chat: {
        ...state.chat,
        contact: {
          ...state.chat.contact,
          ['1']: {
            ...state.chat.contact['1'],
            name: 'Andrea'
          }
        }
      }
    };
    expect(newStateT).toEqual(expected);

    // ramda, not type safe, not refactorable
    const newStateRamda = R.assocPath(
      ['chat', 'contact', '1', 'name'],
      'Andrea',
      state
    );
    expect(newStateRamda).toEqual(expected);

    // immer, looks mutable
    const newStateImmer = produce(state, draft => {
      draft.chat.contact[1].name = 'Andrea';
    });
    expect(newStateImmer).toEqual(expected);

    // iassign, looks somewhat mutable
    const newStateIassign = iassign(
      state,
      s => s.chat.contact['1'],
      c => {
        c.name = 'Andrea';
        return c;
      }
    );
    expect(newStateIassign).toEqual(expected);

    // assoc, type-safe, doesn't look mutable, no duplication
    const newState = assoc(
      state,
      s => s.chat.contact['1'],
      c => ({
        ...c,
        name: 'Andrea'
      })
    );
    expect(newState).toEqual(expected);
  });

  test('dissoc', () => {
    const state: State = {
      chat: {
        contact: {
          '1': { id: '1', name: 'Lars' },
          '2': { id: '2', name: 'Kristian' }
        }
      }
    };
    const expected: State = {
      chat: {
        contact: {
          '2': { id: '2', name: 'Kristian' }
        }
      }
    };

    // typescript, duplicated identifiers
    const { '1': contact, ...contactBut1 } = state.chat.contact;
    const newStateT = {
      ...state,
      chat: {
        ...state.chat,
        contact: {
          ...contactBut1
        }
      }
    };
    expect(newStateT).toEqual(expected);

    // ramda, not type safe, not refactorable
    const newStateRamda = R.dissocPath(['chat', 'contact', '1'], state);
    expect(newStateRamda).toEqual(expected);

    // immer, looks mutable
    const newStateImmer = produce(state, draft => {
      delete draft.chat.contact[1];
    });
    expect(newStateImmer).toEqual(expected);

    // iassign, looks somewhat mutable
    const newStateIassign = iassign(
      state,
      s => s.chat.contact,
      c => {
        delete c['1'];
        return c;
      }
    );
    expect(newStateIassign).toEqual(expected);

    // dissoc, type-safe, doesn't look mutable, no duplication
    const newState = dissoc(state, s => s.chat.contact, '1');
    expect(newState).toEqual(expected);
  });
});

describe('semantics', () => {
  describe('assoc', () => {
    test('update leaf', () => {
      const state = {
        chat: {
          contact: {
            '1': { id: '1', name: 'Lars' },
            '2': { id: '2', name: 'Kristian' }
          }
        }
      };
      const newState = assoc(
        state,
        s => s.chat.contact['1'].name,
        _ => 'Andrea'
      );
      expect(newState).toEqual({
        chat: {
          contact: {
            '1': { id: '1', name: 'Andrea' },
            '2': { id: '2', name: 'Kristian' }
          }
        }
      });
      expect(state).toEqual({
        chat: {
          contact: {
            '1': { id: '1', name: 'Lars' },
            '2': { id: '2', name: 'Kristian' }
          }
        }
      });
      expect(newState.chat.contact['2']).toBe(state.chat.contact['2']);
    });
    test('update non-leaf', () => {
      const state = {
        chat: {
          contact: {
            '1': { id: '1', name: 'Lars' },
            '2': { id: '2', name: 'Kristian' }
          }
        }
      };
      const newState = assoc(
        state,
        s => s.chat.contact['1'],
        c => ({ ...c, name: 'Andrea' })
      );
      expect(newState).toEqual({
        chat: {
          contact: {
            '1': { id: '1', name: 'Andrea' },
            '2': { id: '2', name: 'Kristian' }
          }
        }
      });
      expect(state).toEqual({
        chat: {
          contact: {
            '1': { id: '1', name: 'Lars' },
            '2': { id: '2', name: 'Kristian' }
          }
        }
      });
      expect(newState.chat.contact['2']).toBe(state.chat.contact['2']);
    });
    test('add node', () => {
      const state = {
        chat: {
          contact: {
            '1': { id: '1', name: 'Lars' },
            '2': { id: '2', name: 'Kristian' }
          }
        }
      };
      const newState = assoc(
        state,
        s => s.chat.contact,
        c => ({ ...c, '3': { id: '3', name: 'Andrea' } })
      );
      expect(newState).toEqual({
        chat: {
          contact: {
            '1': { id: '1', name: 'Lars' },
            '2': { id: '2', name: 'Kristian' },
            '3': { id: '3', name: 'Andrea' }
          }
        }
      });
      expect(state).toEqual({
        chat: {
          contact: {
            '1': { id: '1', name: 'Lars' },
            '2': { id: '2', name: 'Kristian' }
          }
        }
      });
      expect(newState.chat.contact['1']).toBe(state.chat.contact['1']);
      expect(newState.chat.contact['2']).toBe(state.chat.contact['2']);
    });
  });
});

describe('performance', () => {
  const ops = 10000;
  const opsPerSecond = (start: bigint) => {
    const ms = Number((process.hrtime.bigint() - start) / BigInt(1e6));
    return Math.trunc(1000 / (ms / ops));
  };
  test('assoc', () => {
    const state: State = {
      chat: {
        contact: {
          '1': { id: '1', name: 'Lars' },
          '2': { id: '2', name: 'Kristian' }
        }
      }
    };

    // ramda
    const ramdaStart = process.hrtime.bigint();
    for (let i = 0; i < ops; ++i) {
      const newStateRamda = R.assocPath(
        ['chat', 'contact', '1', 'name'],
        'Andrea',
        state
      );
    }
    const ramdaOpsPerSecond = opsPerSecond(ramdaStart);
    console.log('ramda', ramdaOpsPerSecond);

    // typescript
    const typescriptStart = process.hrtime.bigint();
    for (let i = 0; i < ops; ++i) {
      const newStateT = {
        ...state,
        chat: {
          ...state.chat,
          contact: {
            ...state.chat.contact,
            ['1']: {
              ...state.chat.contact['1'],
              name: 'Andrea'
            }
          }
        }
      };
    }
    const typescriptOpsPerSecond = opsPerSecond(typescriptStart);
    console.log('typescript', typescriptOpsPerSecond);

    // iassign
    const iassignStart = process.hrtime.bigint();
    for (let i = 0; i < ops; ++i) {
      const newStateIassign = iassign(
        state,
        s => s.chat.contact['1'],
        c => {
          c.name = 'Andrea';
          return c;
        }
      );
    }
    const iassignOpsPerSecond = opsPerSecond(iassignStart);
    console.log('iassign', iassignOpsPerSecond);

    // assoc
    const assocStart = process.hrtime.bigint();
    for (let i = 0; i < ops; ++i) {
      const newState = assoc(
        state,
        s => s.chat.contact['1'],
        c => ({
          ...c,
          name: 'Andrea'
        })
      );
    }
    const assocOpsPerSecond = opsPerSecond(assocStart);
    console.log('assoc', assocOpsPerSecond);

    // immer
    const immerStart = process.hrtime.bigint();
    for (let i = 0; i < ops; ++i) {
      const newStateImmer = produce(state, draft => {
        draft.chat.contact[1].name = 'Andrea';
      });
    }
    const immerOpsPerSecond = opsPerSecond(immerStart);
    console.log('immer', immerOpsPerSecond);

    expect(ramdaOpsPerSecond).toBeGreaterThan(typescriptOpsPerSecond);
    expect(typescriptOpsPerSecond).toBeGreaterThan(iassignOpsPerSecond);
    expect(iassignOpsPerSecond).toBeGreaterThan(assocOpsPerSecond);
    expect(assocOpsPerSecond).toBeGreaterThan(immerOpsPerSecond);

    expect(ramdaOpsPerSecond).not.toBeGreaterThan(4 * typescriptOpsPerSecond);
    expect(ramdaOpsPerSecond).not.toBeGreaterThan(6 * iassignOpsPerSecond);
    expect(ramdaOpsPerSecond).not.toBeGreaterThan(7 * assocOpsPerSecond);
    expect(ramdaOpsPerSecond).not.toBeGreaterThan(12 * immerOpsPerSecond);
  });
});
