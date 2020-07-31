import { createSelector } from 'reselect';
import { createObjectSelector } from 'reselect-map';
import cacheResultOf from '../lib/cacheResultOf';
import { Selector } from '.';
import { Person } from './person';

export const selectPeopleId = cacheResultOf(
  createSelector(
    (state) => state.person,
    (personSet) => {
      // console.log('selectPeopleId');
      return Object.values(personSet).map((p) => p.id);
    }
  ) as Selector<string[]>
);

const ageOf = (date: string) => {
  // console.log(date);
  return Math.trunc(
    (Date.now() - Date.parse(date)) / (24 * 60 * 60 * 1000 * 365)
  );
};

export type PersonInfo = Person & {
  age: number;
};

export const selectPeople: Selector<{
  [id: string]: PersonInfo;
}> = createObjectSelector(
  (state) => state.person,
  (person) => {
    // console.log('selectPeople', person);
    return {
      ...person,
      age: ageOf(person.birthDate),
    };
  }
);

export const selectAverageAge: Selector<number> = createSelector(
  selectPeople,
  (personSet) => {
    const idList = Object.keys(personSet);
    return (
      idList.reduce((sum, id) => sum + personSet[id].age, 0) / idList.length
    );
  }
);
