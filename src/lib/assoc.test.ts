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
