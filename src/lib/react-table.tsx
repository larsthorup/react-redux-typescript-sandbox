// import * as assert from 'assert';

// import {
//   Table as MuiTable,
//   TableBody as MuiTableBody,
//   TableCell as MuiTableCell,
//   TableHead as MuiTableHead,
//   TableRow as MuiTableRow,
//   TableSortLabel,
// } from '@material-ui/core';
// import React, {
//   CSSProperties,
//   PropsWithChildren,
//   ReactElement,
//   ReactNode,
//   useState,
// } from 'react';

// import { TableRowStatusColor } from '../style/colors';
// import IconActionButton from './button/IconActionButton';
// import { EditIcon } from './icons';

// export type TableSortDirection = 'asc' | 'desc';

// const reverse = (direction: TableSortDirection) => {
//   return direction === 'asc' ? 'desc' : 'asc';
// };

// export type TableSortOrder = {
//   columnName: string;
//   direction: TableSortDirection;
// };

// /**
//  * The type of each item of the `columns` prop on the `Table` component
//  * You should usually type the collection like this:
//  * `const columns: TableColumn<typeof rows[0], RowData>[] = [...]`
//  */
// export type TableColumn<TRow, TRowData = any> = {
//   /**
//    * The ReactNode to render in the specified (column, rowIndex) cell
//    */
//   cell?:
//     | ReactNode
//     | ((row: TRow, rowIndex: number, data: TRowData) => ReactNode);
//   /**
//    * The CSSProperties to add to the `<td>` of the specified (column, rowIndex) cell
//    */
//   cellStyle?:
//     | CSSProperties
//     | ((row: TRow, rowIndex: number, data: TRowData) => CSSProperties);
//   /**
//    * `true` if this column is to contain a button for the user to edit data in the row
//    */
//   editButton?: boolean;
//   /**
//    * `true` if this column should be excluded, e.g. based on a feature toggle
//    */
//   isExcluded?: boolean;
//   /**
//    * `true` if this column enables the user to sort the rows based on the column
//    */
//   isSortable?: boolean;
//   /**
//    * A unique name used to identify the column when sorting
//    */
//   name?: string;
//   /**
//    * The text to use as column header
//    */
//   title: string;
//   /**
//    * `number` to right-align cell content
//    */
//   type?: 'string' | 'number';
// };

// /**
//  * The type of the `rowOptions` prop on the `Table` component
//  * You should usually type this object like this:
//  * `const rowOptions: TableRowOptions<typeof rows[0], RowData>[] = [...]`
//  */
// export type TableRowOptions<TRow, TRowData = any> = {
//   /**
//    * The ReactNode to render across the width of the table to enable the user to edit the data
//    * of the specified row. Invoke `onClose` to close the editor
//    */
//   editor?: (
//     onClose: () => void,
//     row: TRow,
//     index: number,
//     data: TRowData
//   ) => ReactElement;
//   /**
//    * `true`, if the user should be able to edit the specified row
//    */
//   isEditable?: (row: TRow, index: number, data: TRowData) => boolean;
//   /**
//    * `true` if this row should be excluded
//    */
//   isExcluded?: (row: TRow, index: number, data: TRowData) => boolean;
//   /**
//    * The name to use when labeling the current row, used on the edit button
//    */
//   label?: (row: TRow, index: number, data: TRowData) => string;
//   /**
//    * Props to add to the `<tr>` of the specified row
//    */
//   props?: (row: TRow, index: number, data: TRowData) => { [name: string]: any };
//   /**
//    * The CSSProperties to add to the `<tr>` of the specified row
//    */
//   style?: (row: TRow, index: number, rowData: TRowData) => CSSProperties;
//   /**
//    * React Hook to select data for the current row which is passed along in most functions here.
//    * Must observe Hook principles, such as never calling other hooks conditionally or in loops
//    * Use this hook to avoid re-rendering the entire table when the user edits a single row, by keeping
//    * editable row data in TRowData and only row ids in TRow.
//    */
//   useData?: (row: TRow, index: number) => TRowData;
// };

// type TableProps<TRow> = {
//   /**
//    * How to render each column of the table
//    */
//   columns: TableColumn<TRow>[];
//   /**
//    * Invoked when the user requests a different sort order
//    */
//   onSortOrderChange?: (sortOrder: TableSortOrder) => void;
//   /**
//    * How to render each row of the table
//    */
//   rowOptions?: TableRowOptions<TRow>;
//   /**
//    * Data for each row of the table
//    */
//   rows: TRow[];
//   /**
//    * The current sort order, if sorting is enabled for any columns
//    */
//   sortOrder?: TableSortOrder;
//   /**
//    * Make the header stick to the top of the view port when long tables scroll
//    */
//   stickyHeader?: boolean;
//   /**
//    * Not used yet
//    */
//   title?: string;
// };
// function Table<TRow>({
//   columns,
//   onSortOrderChange,
//   rowOptions,
//   rows,
//   sortOrder,
//   stickyHeader,
//   title,
// }: PropsWithChildren<TableProps<TRow>>) {
//   const columnList = columns.filter((c) => !c.isExcluded);
//   return (
//     <MuiTable size="small" stickyHeader={stickyHeader}>
//       <MuiTableHead>
//         <TableHeaderRow
//           columns={columnList}
//           onSortOrderChange={onSortOrderChange}
//           sortOrder={sortOrder}
//         />
//       </MuiTableHead>
//       <MuiTableBody>
//         {rows.map((row, rowIndex) => {
//           return (
//             <TableRow
//               columns={columnList}
//               rowOptions={rowOptions || {}}
//               row={row}
//               rowIndex={rowIndex}
//               key={rowIndex}
//             />
//           );
//         })}
//       </MuiTableBody>
//     </MuiTable>
//   );
// }

// type TableHeaderRowProps<TRow> = {
//   columns: TableColumn<TRow>[];
//   onSortOrderChange?: (sortOrder: TableSortOrder) => void;
//   sortOrder?: TableSortOrder;
// };
// function TableHeaderRow<TRow>({
//   columns,
//   onSortOrderChange,
//   sortOrder,
// }: PropsWithChildren<TableHeaderRowProps<TRow>>) {
//   const fontWeight = 'bold';
//   return (
//     <MuiTableRow>
//       {columns.map(({ name, isSortable, title, type = 'string' }, key) => {
//         const align = type === 'number' ? 'right' : 'left';
//         const columnControl = (() => {
//           if (sortOrder && onSortOrderChange && isSortable && name) {
//             const { columnName, direction } = sortOrder;
//             const isSortedByThisColumn = columnName === name;
//             const newDirection = isSortedByThisColumn
//               ? reverse(direction)
//               : 'asc';
//             return (
//               <TableSortLabel
//                 active={isSortedByThisColumn}
//                 direction={direction}
//                 onClick={() =>
//                   onSortOrderChange({
//                     columnName: name,
//                     direction: newDirection,
//                   })
//                 }
//               >
//                 {title}
//               </TableSortLabel>
//             );
//           } else {
//             return <>{title}</>;
//           }
//         })();
//         return (
//           <MuiTableCell align={align} style={{ fontWeight }} key={key}>
//             {columnControl}
//           </MuiTableCell>
//         );
//       })}
//     </MuiTableRow>
//   );
// }

// type TableRowProps<TRow> = {
//   columns: TableColumn<TRow>[];
//   rowOptions: TableRowOptions<TRow>;
//   row: TRow;
//   rowIndex: number;
// };
// function TableRow<TRow>({
//   columns,
//   rowOptions,
//   row,
//   rowIndex,
// }: PropsWithChildren<TableRowProps<TRow>>) {
//   const useData = rowOptions.useData || (() => null);
//   const rowData = useData(row, rowIndex);
//   const [isEditing, setIsEditing] = useState(false);
//   const isExcluded =
//     rowOptions.isExcluded && rowOptions.isExcluded(row, rowIndex, rowData);
//   const editHandler = () => {
//     setIsEditing(true);
//   };
//   const closeHandler = () => {
//     setIsEditing(false);
//   };
//   if (isExcluded) {
//     return <MuiTableRow style={{ display: 'none' }} />;
//   } else if (isEditing) {
//     if (!rowOptions.editor) assert.fail();
//     const editor = rowOptions.editor(closeHandler, row, rowIndex, rowData);
//     const style = { backgroundColor: TableRowStatusColor.Editing };
//     return (
//       <MuiTableRow>
//         <MuiTableCell colSpan={columns.length} style={style}>
//           {editor}
//         </MuiTableCell>
//       </MuiTableRow>
//     );
//   } else {
//     const isEditable = rowOptions.isEditable
//       ? rowOptions.isEditable(row, rowIndex, rowData)
//       : true;
//     const rowProps = rowOptions.props
//       ? rowOptions.props(row, rowIndex, rowData)
//       : {};
//     const style = rowOptions.style
//       ? rowOptions.style(row, rowIndex, rowData)
//       : {};
//     return (
//       <MuiTableRow style={style} {...rowProps}>
//         <TableRowView
//           row={row}
//           rowData={rowData}
//           rowIndex={rowIndex}
//           isEditable={isEditable}
//           columns={columns}
//           rowOptions={rowOptions}
//           onEdit={editHandler}
//         />
//       </MuiTableRow>
//     );
//   }
// }

// type TableRowViewProps<TRow, TRowData> = {
//   columns: TableColumn<TRow, TRowData>[];
//   isEditable: boolean;
//   onEdit: () => void;
//   rowOptions: TableRowOptions<TRow, TRowData>;
//   row: TRow;
//   rowData: TRowData;
//   rowIndex: number;
// };
// function TableRowView<TRow, TRowData>({
//   columns,
//   isEditable,
//   onEdit,
//   rowOptions,
//   row,
//   rowData,
//   rowIndex,
// }: PropsWithChildren<TableRowViewProps<TRow, TRowData>>) {
//   return (
//     <>
//       {columns.map((column, columnIndex) => {
//         const { cell, cellStyle, editButton, type = 'string' } = column;
//         const align = type === 'number' ? 'right' : 'left';
//         const element = (
//           <>
//             {(() => {
//               if (isEditable && editButton) {
//                 const label = rowOptions.label
//                   ? rowOptions.label(row, rowIndex, rowData)
//                   : `row ${columnIndex}`;
//                 return (
//                   <IconActionButton
//                     icon={<EditIcon />}
//                     label={`Edit ${label}`}
//                     onClick={onEdit}
//                   />
//                 );
//               } else if (typeof cell === 'function') {
//                 return cell(row, rowIndex, rowData);
//               } else {
//                 return cell;
//               }
//             })()}
//           </>
//         );
//         const style = (() => {
//           switch (typeof cellStyle) {
//             case 'undefined':
//               return undefined;
//             case 'object':
//               return cellStyle;
//             case 'function':
//               return cellStyle(row, rowIndex, rowData);
//           }
//         })();
//         return (
//           <MuiTableCell align={align} key={columnIndex} style={style}>
//             {element}
//           </MuiTableCell>
//         );
//       })}
//     </>
//   );
// }

function Table() {}
export default Table;
