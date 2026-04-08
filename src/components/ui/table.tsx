import type { ReactNode } from "react";

type TableColumn = {
  key: string;
  header: string;
  className?: string;
};

type TableProps<T> = {
  columns: TableColumn[];
  rows: T[];
  renderCell: (row: T, columnKey: string, rowIndex: number) => ReactNode;
};

export const Table = <T,>({ columns, rows, renderCell }: TableProps<T>) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 bg-white text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th
                className={`whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                  column.className ?? ""
                }`}
                key={column.key}
                scope="col"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, rowIndex) => (
            <tr className="hover:bg-slate-50/70" key={rowIndex}>
              {columns.map((column) => (
                <td className="px-4 py-3 text-slate-700" key={column.key}>
                  {renderCell(row, column.key, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
