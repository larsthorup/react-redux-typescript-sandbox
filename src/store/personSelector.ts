import { createSelector } from 'reselect';
import { createObjectSelector } from 'reselect-map';
import cacheResultOf from '../lib/cacheResultOf';
import { Selector } from '.';

export const selectPeopleId = cacheResultOf(
  createSelector(
    state => state.person,
    person => {
      return Object.values(person).map(p => p.id);
    }
  ) as Selector<string[]>
);

const ageOf = (date: string) => {
  // console.log(date);
  return Math.trunc(
    (Date.now() - Date.parse(date)) / (24 * 60 * 60 * 1000 * 365)
  );
};

export const selectPeopleAge: Selector<{
  [id: string]: number;
}> = createObjectSelector(
  state => state.person,
  ({ birthDate }) => ageOf(birthDate)
);

export const selectAverageAge: Selector<number> = createSelector(
  selectPeopleAge,
  age => {
    const idList = Object.keys(age);
    return idList.reduce((sum, id) => sum + age[id], 0) / idList.length;
  }
);
