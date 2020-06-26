import React, { useState } from 'react';

const TextField: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [editedValue, setEditedValue] = useState(value); // TODO
  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = ev => {
    setEditedValue(ev.target.value);
  };
  const saveHandler = () => {
    onChange(editedValue);
  };
  return (
    <>
      <input value={editedValue} onChange={changeHandler} />
      <button onClick={saveHandler}>Save</button>
    </>
  );
};

export default TextField;
