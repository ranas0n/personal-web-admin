import React, { useState } from "react";
import { useReactTable, createColumnHelper, getCoreRowModel, flexRender, getPaginationRowModel } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Stack } from "@/interfaces/Stack";
import { handleDelete } from "@/services/dataOperations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Define props for the table component
interface StackDataTableProps {
  table_name: string;
  data: Stack[];
}

const columnHelper = createColumnHelper<Stack>();

export const StackDataTable: React.FC<StackDataTableProps> = ({ table_name, data }) => {
  const queryClient = useQueryClient();
  const [pageSize, setPageSize] = useState(8);

  const deleteMutation = useMutation<void, Error, number | undefined>({
    mutationFn: (id) => handleDelete(id, "stack"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stacks"] }),
  });

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("logo", {
      header: "Logo",
      cell: (info) => (
        <img src={info.getValue()} alt="Logo" width="50" />
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button>
            <Link to={`/stack/${row.original.id}`}>Update</Link>
          </Button>
          <Button
            onClick={() => deleteMutation.mutate(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: pageSize } },
  });

  return (
    <div className="max-w-full border-stroke dark:border-strokedark">
      <Button className="mb-2">
        <Link to={`/stack/`}>Add {table_name}</Link>
      </Button>
      
      <table className="w-full border-collapse border border-stroke dark:border-strokedark">
        <caption className="text-lg font-semibold my-2">A list of your {table_name} data.</caption>
        
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border border-stroke dark:border-strokedark p-2">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border border-stroke dark:border-strokedark">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-stroke dark:border-strokedark p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <span>
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of {table.getPageCount()}
        </span>
        <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
};
