import React, { useState } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Project } from "@/interfaces/Project";
import { handleDelete } from "@/services/dataOperations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ProjectDataTableProps {
  table_name: string;
  data: Project[];
}

const columnHelper = createColumnHelper<Project>();

export const ProjectDataTable: React.FC<ProjectDataTableProps> = ({ table_name, data }) => {
  const queryClient = useQueryClient();
  const [pageSize, setPageSize] = useState(8);

  const deleteMutation = useMutation<void, Error, number | undefined>({
    mutationFn: (id) => handleDelete(id, "project"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const columns = [
    columnHelper.accessor("proj_id", {
      header: "ID",
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor("proj_img", {
      header: "Image",
      cell: (info) => <img src={info.getValue()} alt="Project" width="50" />,
    }),
    columnHelper.accessor("proj_name", {
      header: "Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("hosting", {
      header: "Hosting URL",
      cell: (info) => (
        <a className="text-blue-400" href={info.getValue()} target="_blank">
          {info.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("github", {
      header: "GitHub Repo",
      cell: (info) => (
        <a className="text-blue-400" href={info.getValue()} target="_blank">
          {info.getValue()}
        </a>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button>
            <Link to={`/project/${row.original.proj_id}`}>Update</Link>
          </Button>
          <Button onClick={() => deleteMutation.mutate(row.original.proj_id)}>
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
    <div className="max-w-full">
      <Button className="mb-2">
        <Link to={`/project/`}>Add {table_name}</Link>
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

      {/* Pagination Controls */}
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
