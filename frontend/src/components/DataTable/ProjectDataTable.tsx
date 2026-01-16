import React, { useEffect, useRef } from "react";
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-select';
import 'datatables.net-buttons';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { Project } from "@/interfaces/Project";
import { handleDelete } from "@/services/dataOperations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ProjectDataTableProps {
  table_name: string;
  data: Project[];
}

export const ProjectDataTable: React.FC<ProjectDataTableProps> = ({ table_name, data }) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<void, Error, number | undefined>({
    mutationFn: (id) => handleDelete(id, "project"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  useEffect(() => {
    if (tableRef.current && data.length > 0) {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }

      $(tableRef.current).DataTable({
        data: data,
        columns: [
          { data: 'proj_id', title: 'ID', width: '5%' },
          {
            data: 'proj_img',
            title: 'Image',
            width: '10%',
            render: (data: string) => `<img src="${data}" alt="Project" width="50" />`
          },
          { data: 'proj_name', title: 'Name' },
          { data: 'description', title: 'Description', className: 'text-justify' },
          { data: 'category', title: 'Category', render: (data: string) => `<span style="display: inline-block; padding: 0.25rem 0.5rem; background-color: #dbeafe; color: #1e40af; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">${data}</span>` },
          {
            data: 'hosting',
            title: 'Hosting URL',
            render: (data: string) => `<a href="${data}" target="_blank" class="text-blue-400">${data}</a>`
          },
          {
            data: 'github',
            title: 'GitHub Repo',
            render: (data: string) => `<a href="${data}" target="_blank" class="text-blue-400">${data}</a>`
          }
        ],
        pageLength: 8,
        select: true,
        dom: '<"top"fB>rtip',
        buttons: [
          {
            text: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
            title: 'Add Project',
            className: 'btn-add',
            action: () => window.location.href = '/project/'
          },
          {
            text: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
            title: 'Edit Selected',
            className: 'btn-edit',
            action: function(this: any) {
              const selected = this.rows({ selected: true }).data();
              if (selected.length === 1) {
                window.location.href = `/project/${selected[0].proj_id}`;
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
                if (confirm(`Delete ${selected.length} selected project(s)?`)) {
                  selected.each((row: Project) => deleteMutation.mutate(row.proj_id));
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
