import React from 'react';
import { useSelector, useDispatch } from '../store';
import personSlice from '../store/person';
import {
  selectPeopleIdByName,
  selectPeopleAge,
  selectAverageAge as selectPersonAgeAverage
} from '../store/personSelector';
import Table, { TableColumn } from '../lib/react-table';
import { historyBack } from '../lib/redux-history';

const PeopleTable: React.FC = () => {
  const dispatch = useDispatch();
  const personIdList = useSelector(selectPeopleIdByName);
  const rows = personIdList.concat(['']); // Note: '' used to indicate the extra row for totals
  const columns: TableColumn<typeof rows[0]>[] = [
    { title: '', cell: '' },
    { title: 'Name', cell: id => (id ? <Name id={id} /> : '') },
    { title: 'Age', cell: id => (id ? <Age id={id} /> : <AverageAge />) },
    { title: '', cell: id => (id ? <UpdateButton id={id} /> : '') }
  ];
  return (
    <>
      <Table columns={columns} rows={rows} />
      <button onClick={() => dispatch(historyBack())}>Back</button>
    </>
  );
};

const Name: React.FC<{ id: string }> = ({ id }) => {
  const { name } = useSelector(state => state.person[id]);
  // console.log(name);
  return <span>{name}</span>;
};

const Age: React.FC<{ id: string }> = ({ id }) => {
  const age = useSelector(state => selectPeopleAge(state)[id]);
  return <span>{age}</span>;
};

const UpdateButton: React.FC<{ id: string }> = ({ id }) => {
  const dispatch = useDispatch();
  const updateBirthDate = () => {
    const birthDate = Math.trunc(Math.random() * 100 + 1920).toString();
    dispatch(personSlice.actions.updateBirthDate({ id, birthDate }));
  };
  return <button onClick={updateBirthDate}>random</button>;
};

const AverageAge: React.FC = () => {
  const averageAge = useSelector(selectPersonAgeAverage);
  return <span>{averageAge}</span>;
};

export default PeopleTable;
