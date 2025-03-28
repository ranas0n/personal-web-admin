import React from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
  } from "../ui/table";
import { Project } from "@/interfaces/Project";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { handleDelete } from "@/services/dataOperations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ProjectDataTableProps {
  table_name : string;
  data: Project[];
}


export const ProjectDataTable: React.FC<ProjectDataTableProps> = ({ table_name, data }) => {
  const queryClient = useQueryClient();
  
  const deleteMutation = useMutation<void, Error, number | undefined>({
    mutationFn: (id) => handleDelete(id, "stack"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] })
  });
  return (
    <div className="max-w-full">
      <div>
        <Button className="mb-2">
          <Link to={`/project/`}>
            Add {table_name}
          </Link>
        </Button>  
      </div>
      <Table>
        <TableCaption>A list of your {table_name} data.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            {/* <TableHead>Stacks Used</TableHead> */}
            <TableHead>Hosting URL</TableHead>
            <TableHead>Github Repo</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.proj_id}>
              <TableCell>
                <img src={item.proj_img} alt={item.proj_name} width="50" />
              </TableCell>
              <TableCell className="font-medium">{item.proj_id}</TableCell>
              <TableCell>{item.proj_name}</TableCell>
              <TableCell>
                {item.description}
              </TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>
                <a className='text-blue-400' href={item.hosting} target="_blank">
                  {item.hosting}
                </a>
              </TableCell>
              <TableCell>
              <a className='text-blue-400' href={item.github} target="_blank">
                  {item.github}
                </a>
              </TableCell>
              <TableCell className="min-w-fit">
                <Button className="m-1">
                  <Link to={`/project/${item.proj_id}`}>Update</Link>
                </Button>
                <Button className="m-1" onClick={() => {
                  deleteMutation.mutate(item.proj_id);
                  console.log('Delete Button Clicked!');
                  // window.location.reload();
                }}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};


