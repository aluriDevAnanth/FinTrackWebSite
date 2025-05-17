import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type Table as TTable,
  TableState,
} from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useLocalStorage } from "usehooks-ts";

import DataTableHeader from "./DataTableHeader";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ReactElement } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoveLeft,
  MoveRight,
  Pin,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
  tableName: string;
  columns: ColumnDef<TData, TValue>[];
  AddDialog: (props: { table: TTable<TData> }) => ReactElement;
  setData: React.Dispatch<React.SetStateAction<TData[]>>;
  data: TData[];
  paginationArr: number[];
}

export default function DataTable<TData, TValue>({
  tableName = "tablee",
  columns,
  AddDialog,
  setData,
  data,
  paginationArr,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableMultiRemove: true,
    enableColumnPinning: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    isMultiSortEvent: () => true,
    meta: { setData },
  });

  const [tableState, setTableState] = useLocalStorage<TableState>(
    tableName + "TableState",
    table.initialState
  );

  table.setOptions((prev) => ({
    ...prev,
    state: tableState,
    onStateChange: (updater) => {
      const newState =
        typeof updater === "function" ? updater(tableState) : updater;
      if (JSON.stringify(newState) !== JSON.stringify(tableState)) {
        setTableState(newState);
      }
    },
  }));

  return (
    <div className="max-w-[100vw]">
      <div className="mb-3 px-3">
        <DataTableHeader<TData> table={table} AddDialog={AddDialog} />
      </div>

      <div className="rounded-md border">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`
                      relative
                      ${header.column.getIsPinned() ? "sticky bg-background" : ""}
                      ${header.column.getIsPinned() === "left" ? "left-0 z-10" : ""}
                      ${header.column.getIsPinned() === "right" ? "right-0 z-10" : ""}
                    `}
                    style={{
                      width: header.getSize(),
                      minWidth: header.column.columnDef.minSize,
                      maxWidth: header.column.columnDef.maxSize,
                    }}
                  >
                    <div className="flex items-center justify-end pl-auto">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanPin() && (
                        <button
                          onClick={() => {
                            if (header.column.getIsPinned() === "left") {
                              header.column.pin("right");
                            } else if (
                              header.column.getIsPinned() === "right"
                            ) {
                              header.column.pin(false);
                            } else {
                              header.column.pin("left");
                            }
                          }}
                          className="ml-2 p-1 rounded hover:text-black hover:bg-slate-200"
                        >
                          {header.column.getIsPinned() === "left" ? (
                            <MoveLeft className="size-4" />
                          ) : header.column.getIsPinned() === "right" ? (
                            <MoveRight className="size-4" />
                          ) : (
                            <Pin className="size-4" />
                          )}
                        </button>
                      )}
                    </div>
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`
                          absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none
                          hover:bg-blue-500 active:bg-blue-600
                          ${header.column.getIsResizing() ? "bg-blue-600" : "bg-gray-300"}
                        `}
                      />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="divide-x-2"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`
                        ${cell.column.getIsPinned() ? "sticky bg-background" : ""}
                        ${cell.column.getIsPinned() === "left" ? "left-0 z-10" : ""}
                        ${cell.column.getIsPinned() === "right" ? "right-0 z-10" : ""}
                      `}
                      style={{
                        width: cell.column.getSize(),
                        minWidth: cell.column.columnDef.minSize,
                        maxWidth: cell.column.columnDef.maxSize,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </p>
          <span className="flex items-center gap-3">
            | Go to page:
            <Input
              type="number"
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-16 rounded border p-1"
              min={1}
              max={table.getPageCount() || 1}
            />
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
              table.setPageIndex(0);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Page size" />
            </SelectTrigger>
            <SelectContent>
              {paginationArr.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  Show {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm font-medium">
            Total: {table.getPrePaginationRowModel().rows.length} items
          </span>
        </div>
      </div>
    </div>
  );
}
