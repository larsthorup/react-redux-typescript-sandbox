import { createSlice, SliceReducer } from '../lib/redux-slice';

export type Person = {
  id: string;
  name: string;
  birthDate: string;
};

export type PersonState = Readonly<{ [id: string]: Person }>;

type PersonReducer<TPayload> = SliceReducer<PersonState, TPayload>;

const initialState: PersonState = {
  '1': { id: '1', name: 'Adam', birthDate: '2012' },
  '2': { id: '2', name: 'Susan', birthDate: '1994' },
  '3': { id: '3', name: 'Joey', birthDate: '1966' },
  '4': { id: '4', name: 'Ronja', birthDate: '1977' }
};

const updateBirthDate: PersonReducer<{ id: string; birthDate: string }> = (
  state,
  { id, birthDate }
) => {
  return {
    ...state,
    [id]: {
      ...state[id],
      birthDate
    }
  };
};

export default createSlice({
  name: 'person',
  initialState,
  reducers: {
    updateBirthDate
  }
});
