import React, { useEffect, useRef } from "react";
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-select';
import 'datatables.net-buttons';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { Stack } from "@/interfaces/Stack";
import { handleDelete } from "@/services/dataOperations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface StackDataTableProps {
  table_name: string;
  data: Stack[];
}

export const StackDataTable: React.FC<StackDataTableProps> = ({ table_name, data }) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<void, Error, number | undefined>({
    mutationFn: (id) => handleDelete(id, "stack"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stacks"] }),
  });

  useEffect(() => {
    if (tableRef.current && data.length > 0) {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }

      $(tableRef.current).DataTable({
        data: data,
        columns: [
          { data: 'id', title: 'ID', width: '5%' },
          { data: 'name', title: 'Name' },
          { data: 'category', title: 'Category', render: (data: string) => `<span style="display: inline-block; padding: 0.25rem 0.5rem; background-color: #dbeafe; color: #1e40af; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">${data}</span>` },
          {
            data: 'logo',
            title: 'Logo',
            render: (data: string) => `<img src="${data}" alt="Logo" width="50" />`
          }
        ],
        pageLength: 8,
        select: true,
        dom: '<"top"fB>rtip',
        buttons: [
          {
            text: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
            title: 'Add Stack',
            className: 'btn-add',
            action: () => window.location.href = '/stack/'
          },
          {
            text: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
            title: 'Edit Selected',
            className: 'btn-edit',
            action: function(this: any) {
              const selected = this.rows({ selected: true }).data();
              if (selected.length === 1) {
                window.location.href = `/stack/${selected[0].id}`;
              } else {
                alert('Please select exactly one row to edit.');
              }
            }
          },
          {
            text: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
            title: 'Delete Selected',
            className: 'btn-delete',
            action: function(this: any) {
              const selected = this.rows({ selected: true }).data();
              if (selected.length > 0) {
                if (confirm(`Delete ${selected.length} selected stack(s)?`)) {
                  selected.each((row: Stack) => deleteMutation.mutate(row.id));
                }
              } else {
                alert('Please select rows to delete.');
              }
            }
          }
        ]
      });
    }
  }, [data]);

  return (
    <div className="w-full">
      <div className="overflow-x-auto bg-white dark:bg-boxdark rounded-lg shadow">
        <table ref={tableRef} className="display min-w-full"></table>
      </div>
    </div>
  );
};
