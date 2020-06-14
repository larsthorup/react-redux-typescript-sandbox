import React from 'react';
import { useSelector, useDispatch, TableColumn } from '../store';
import personSlice from '../store/person';
import {
  selectPeopleId,
  selectPeopleAge,
  selectAverageAge as selectPersonAgeAverage
} from '../store/personSelector';
import Table from '../lib/react-redux-table';
import { historyBack } from '../lib/redux-history';

const PeopleTable: React.FC = () => {
  const dispatch = useDispatch();
  const personIdList = useSelector(selectPeopleId);
  const rows = personIdList;
  const columns: TableColumn<typeof rows[0]>[] = [
    { title: '', summaryCell: 'Average' },
    {
      title: 'Name',
      selector: id => state => state.person[id].name,
      sortable: true
    },
    {
      title: 'Age',
      selector: id => state => selectPeopleAge(state)[id],
      sortable: true,
      summarySelector: selectPersonAgeAverage
    },
    { title: '', cell: id => <UpdateButton id={id} /> }
  ];
  return (
    <>
      <Table columns={columns} rows={rows} />
      <button onClick={() => dispatch(historyBack())}>Back</button>
    </>
  );
};

const UpdateButton: React.FC<{ id: string }> = ({ id }) => {
  const dispatch = useDispatch();
  const updateBirthDate = () => {
    const birthDate = Math.trunc(Math.random() * 100 + 1920).toString();
    dispatch(personSlice.actions.updateBirthDate({ id, birthDate }));
  };
  return <button onClick={updateBirthDate}>random</button>;
};

export default PeopleTable;
