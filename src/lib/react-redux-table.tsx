import * as R from 'ramda';
import React, { PropsWithChildren, useState } from 'react';
import { useSelector } from 'react-redux';
import cacheResultOf from './cacheResultOf';

export type TableColumn<TState, TRow> = {
  cell?:
    | number
    | string
    | React.ReactElement
    | ((row: TRow) => number | string | React.ReactElement);
  selector?: (row: TRow) => (state: TState) => number | string;
  sortable?: boolean;
  summaryCell?:
    | number
    | string
    | React.ReactElement
    | (() => number | string | React.ReactElement);
  summarySelector?: (state: TState) => number | string;
  title: string;
};

type TableProps<TState, TRow> = {
  columns: TableColumn<TState, TRow>[];
  rows: TRow[];
};
function Table<TState, TRow>({
  columns,
  rows
}: PropsWithChildren<TableProps<TState, TRow>>) {
  const [isSorted, setIsSorted] = useState(false);
  const [sortColumnIndex, setSortColumnIndex] = useState(0);
  return (
    <table>
      <thead>
        <tr>
          {columns.map(({ sortable, title }, columnIndex) => {
            const sortEnableHandler = () => {
              setIsSorted(true);
              setSortColumnIndex(columnIndex);
            };
            return (
              <td style={{ fontWeight: 'bold' }} key={columnIndex}>
                {title}
                {sortable && <button onClick={sortEnableHandler}>sort</button>}
              </td>
            );
          })}
        </tr>
      </thead>
      <TableBody
        columns={columns}
        rows={rows}
        isSorted={isSorted}
        sortColumnIndex={sortColumnIndex}
      />
    </table>
  );
}

type TableBodyProps<TState, TRow> = {
  columns: TableColumn<TState, TRow>[];
  rows: TRow[];
  isSorted: boolean;
  sortColumnIndex: number;
};
function TableBody<TState, TRow>({
  columns,
  rows,
  isSorted,
  sortColumnIndex
}: PropsWithChildren<TableBodyProps<TState, TRow>>) {
  const rowList = useSelector(
    cacheResultOf((state: TState) => {
      // console.log('rowList'); // TODO: avoid recalculate on every state change!!
      const isRowIncluded = (r: TRow) => true;
      const filteredRows = rows.filter(isRowIncluded);
      const sortValue = (row: TRow) =>
        columns[sortColumnIndex].selector!(row)(state);
      const sortedRows = isSorted
        ? R.sortBy(sortValue, filteredRows)
        : filteredRows;
      const rowCount = 100;
      const rowSubset = sortedRows.slice(0, rowCount);
      return rowSubset;
    })
  );
  return (
    <tbody>
      {rowList.map((row, key) => {
        return <TableRow row={row} columns={columns} key={key} />;
      })}
      <TableSummaryRow columns={columns} />
    </tbody>
  );
}

type TableRowProps<TState, TRow> = {
  columns: TableColumn<TState, TRow>[];
  row: TRow;
};
function TableRow<TState, TRow>({
  columns,
  row
}: PropsWithChildren<TableRowProps<TState, TRow>>) {
  // TODO: eventually support row-level selector for shared computations
  return (
    <tr>
      {columns.map((column, columnIndex) => {
        return <TableCell row={row} column={column} key={columnIndex} />;
      })}
    </tr>
  );
}

type TableCellProps<TState, TRow> = {
  column: TableColumn<TState, TRow>;
  row: TRow;
};
function TableCell<TState, TRow>({
  column: { cell, selector },
  row
}: PropsWithChildren<TableCellProps<TState, TRow>>) {
  const value = useSelector(selector ? selector(row) : () => undefined);
  const element = (() => {
    switch (typeof cell) {
      case 'undefined':
        return <span>{value}</span>;
      case 'number':
      case 'string':
        return <>{cell}</>;
      case 'function':
        return <>{cell(row)}</>;
    }
  })();
  return <td>{element}</td>;
}

type TableSummaryRowProps<TState, TRow> = {
  columns: TableColumn<TState, TRow>[];
};
function TableSummaryRow<TState, TRow>({
  columns
}: PropsWithChildren<TableSummaryRowProps<TState, TRow>>) {
  // TODO: eventually support row-level selector for shared computations
  const hasSummary = columns.reduce(
    (any, column) => !!(any || column.summaryCell || column.summarySelector),
    false
  );
  if (!hasSummary) return null;
  return (
    <tr>
      {columns.map((column, columnIndex) => {
        return <TableSummaryCell column={column} key={columnIndex} />;
      })}
    </tr>
  );
}

type TableSummaryCellProps<TState, TRow> = {
  column: TableColumn<TState, TRow>;
};
function TableSummaryCell<TState, TRow>({
  column: { summaryCell, summarySelector }
}: PropsWithChildren<TableSummaryCellProps<TState, TRow>>) {
  const value = useSelector(
    summarySelector ? summarySelector : () => undefined
  );
  const element = (() => {
    switch (typeof summaryCell) {
      case 'undefined':
        return <span>{value}</span>;
      case 'number':
      case 'string':
        return <>{summaryCell}</>;
      case 'function':
        return <>{summaryCell()}</>;
    }
  })();
  return <td>{element}</td>;
}

export default Table;
