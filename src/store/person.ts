import { createSlice, SliceReducer } from '../lib/redux-slice';

export type Person = {
  id: string;
  name: string;
  birthDate: string;
};

export type PersonState = Readonly<{ [id: string]: Person }>;

type PersonReducer<TPayload> = SliceReducer<PersonState, TPayload>;

const initialState: PersonState = {};

const addPeople: PersonReducer<{ [id: string]: Person }> = (state, people) => {
  return {
    ...state,
    ...people,
  };
};

const updateBirthDate: PersonReducer<{ id: string; birthDate: string }> = (
  state,
  { id, birthDate }
) => {
  return {
    ...state,
    [id]: {
      ...state[id],
      birthDate,
    },
  };
};

const updateName: PersonReducer<{ id: string; name: string }> = (
  state,
  { id, name }
) => {
  return {
    ...state,
    [id]: {
      ...state[id],
      name,
    },
  };
};

export default createSlice({
  name: 'person',
  initialState,
  reducers: {
    addPeople,
    updateBirthDate,
    updateName,
  },
});
