import React, { PropsWithChildren } from 'react';

export type TableColumn<TRow> = {
  cell:
    | number
    | string
    | React.ReactElement
    | ((row: TRow) => number | string | React.ReactElement);
  title: string;
};

type Props<TRow> = {
  columns: TableColumn<TRow>[];
  rows: TRow[];
};
function Table<TRow>({ columns, rows }: PropsWithChildren<Props<TRow>>) {
  const fontWeight = 'bold'; // Note: for the header
  return (
    <table>
      <thead>
        <tr>
          {columns.map(({ title }, key) => {
            return (
              <td style={{ fontWeight }} key={key}>
                {title}
              </td>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rows.flatMap((row, key) => {
          return (
            <tr key={key}>
              {columns.map(({ cell }, key) => {
                const element = (() => {
                  switch (typeof cell) {
                    case 'number':
                    case 'string':
                      return <>{cell}</>;
                    case 'function':
                      return <>{cell(row)}</>;
                  }
                })();
                return <td key={key}>{element}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;
