import { Dispatch, SetStateAction, useState } from 'react';

function useStateFromProps<T>(data: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(data);
  const [prevData, setPrevData] = useState(data);
  if (prevData !== data) {
    const newData = data;
    setState(newData);
    setPrevData(data);
  }
  return [state, setState];
}

export default useStateFromProps;
