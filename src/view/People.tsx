import React from 'react';
import { useSelector, useDispatch } from '../store';
import personSlice from '../store/person';
import { selectPeopleIdByName, selectPeopleAge } from '../store/personSelector';

const People: React.FC = () => {
  const personIdList = useSelector(selectPeopleIdByName);
  return (
    <table>
      <thead>
        <tr>
          <td></td>
          <td>Name</td>
          <td>Age</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {personIdList.map(id => {
          return <Person id={id} key={id} />;
        })}
        <PersonAverage />
      </tbody>
    </table>
  );
};

const Person: React.FC<{ id: string }> = ({ id }) => {
  const dispatch = useDispatch();
  const person = useSelector(state => state.person[id]);
  const age = useSelector(state => selectPeopleAge(state)[id]);
  const updateBirthDate = () => {
    const birthDate = Math.trunc(Math.random() * 100 + 1920).toString();
    dispatch(personSlice.actions.updateBirthDate({ id, birthDate }));
  };
  return (
    <tr>
      <td></td>
      <td>{person.name}</td>
      <td>{age}</td>
      <td>
        <button onClick={updateBirthDate}>random</button>
      </td>
    </tr>
  );
};

const PersonAverage: React.FC = () => {
  const age = useSelector(selectPeopleAge);
  return (
    <tr>
      <td>Average</td>
      <td></td>
      <td>
        {Object.keys(age).reduce((sum, id) => sum + age[id], 0) /
          Object.values(age).length}
      </td>
      <td></td>
    </tr>
  );
};

export default People;
