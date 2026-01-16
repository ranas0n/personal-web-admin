import React, { useEffect, useRef } from "react";
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
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
          },
          {
            data: null,
            title: 'Actions',
            width: '15%',
            render: (data: any, type: any, row: Project) => `
              <div class="flex gap-2 justify-center">
                <a href="/project/${row.proj_id}" style="display: inline-flex; align-items: center; padding: 0.25rem 0.75rem; background-color: #2563eb; color: white; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#1d4ed8'" onmouseout="this.style.backgroundColor='#2563eb'">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </a>
                <button onclick="window.deleteProject(${row.proj_id})" style="display: inline-flex; align-items: center; padding: 0.25rem 0.75rem; background-color: #dc2626; color: white; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500; transition: background-color 0.2s; border: none;" onmouseover="this.style.backgroundColor='#b91c1c'" onmouseout="this.style.backgroundColor='#dc2626'">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete
                </button>
              </div>
            `
          }
        ],
        pageLength: 8,
        responsive: true
      });
    }
  }, [data]);

  useEffect(() => {
    (window as any).deleteProject = (id: number) => {
      deleteMutation.mutate(id);
    };
  }, [deleteMutation]);

  return (
    <div className="w-full">
      <div className="mb-4">
        <Button>
          <Link to={`/project/`}>Add {table_name}</Link>
        </Button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-boxdark rounded-lg shadow">
        <table ref={tableRef} className="display min-w-full"></table>
      </div>
    </div>
  );
};
