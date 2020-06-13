import * as R from 'ramda';
import { createSelector } from 'reselect';
import { createObjectSelector } from 'reselect-map';
import cacheResultOf from '../lib/cacheResultOf';
import { RootState, Selector } from '.';
import { PersonState } from './person';

export const selectPeopleIdByName: Selector<string[]> = cacheResultOf(
  createSelector(
    (state: RootState) => state.person,
    (person: PersonState) => {
      return R.sortBy(p => p.name, Object.values(person)).map(p => p.id);
    }
  )
);

const ageOf = (date: string) => {
  console.log(date);
  return Math.trunc(
    (Date.now() - Date.parse(date)) / (24 * 60 * 60 * 1000 * 365)
  );
};

export const selectPeopleAge: Selector<{
  [id: string]: number;
}> = createObjectSelector(
  (state: RootState) => state.person,
  ({ birthDate }) => ageOf(birthDate)
);
