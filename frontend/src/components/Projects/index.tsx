import React from "react";
import { ProjectDataTable } from "../DataTable/ProjectDataTable";
import DefaultLayout from "../Layouts/DefaultLayout";
import { fetchAllData } from "@/services/dataOperations";
import { Project } from "@/interfaces/Project";
import { useQuery } from "@tanstack/react-query";
import Loader from "../common/Loader";

export const Projects : React.FC= () => {
    const {isLoading, error, data:Projects} = useQuery<Project[]>({
        queryKey: ['projects'],
        queryFn: () => fetchAllData('projects'),
    });
    return(
        <DefaultLayout>
            {isLoading && <Loader />}
            {error && <p>There's an error at fetching all projects data: {(error as Error).message}</p>}
            {Projects && <ProjectDataTable data={Projects} table_name="projects"/>}
        </DefaultLayout>
    )
}