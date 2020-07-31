import React from 'react';
import { useSelector, useDispatch } from '../store';
import personSlice, { Person } from '../store/person';
import {
  selectPeopleId,
  selectPersonSummary,
  selectPeople,
  PersonInfo,
} from '../store/personSelector';
import Table, { TableColumn, TableRowOptions } from '../lib/react-redux-table';
import { historyBack } from '../lib/redux-history';
import useAsyncEffect from '../lib/useAsyncEffect';
import person from '../store/person';

const PeopleTable: React.FC = () => {
  const dispatch = useDispatch();
  const personIdList = useSelector(selectPeopleId);
  const { isRunning, isCompleted } = useAsyncEffect(async () => {
    // Note: simulate server request
    await new Promise((resolve) => setTimeout(resolve, 500));
    dispatch(
      person.actions.addPeople({
        '1': { id: '1', name: 'Adam', birthDate: '2012' },
        '2': { id: '2', name: 'Susan', birthDate: '1994' },
        '3': { id: '3', name: 'Joey', birthDate: '1966' },
        '4': { id: '4', name: 'Ronja', birthDate: '1977' },
      })
    );
  });
  const rows = personIdList;
  const rowOptions: TableRowOptions<typeof rows[0], PersonInfo> = {
    useData: (id) => useSelector((state) => selectPeople(state)[id]),
    useDataSummary: () => useSelector(selectPersonSummary),
  };
  const columns: TableColumn<typeof rows[0], PersonInfo>[] = [
    {
      title: '',
      cellSummary: () => 'Average',
    },
    {
      title: 'Name',
      isSortable: true,
      cell: (id, i, person) => person.name,
    },
    {
      title: 'Age',
      type: 'number',
      isSortable: true,
      cell: (id, i, person) => person.age,
      cellSummary: (personSummary) => personSummary.age,
    },
    { title: '', cell: (id) => <UpdateButton id={id} /> },
  ];
  return (
    <>
      {isRunning && <p>Loading...</p>}
      {isCompleted && (
        <Table columns={columns} rows={rows} rowOptions={rowOptions} />
      )}
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
