import React from "react";
import DefaultLayout from "../Layouts/DefaultLayout";
import { Stack } from "@/interfaces/Stack";
import { fetchAllData } from "@/services/dataOperations";
import { StackDataTable } from "../DataTable/StackDataTable";
import { useQuery } from "@tanstack/react-query";
import Loader from "../common/Loader";

export const Stacks : React.FC= () => {
    const {isLoading, error, data:Stacks} = useQuery<Stack[]>({
        queryKey: ['stacks'],
        queryFn : () => fetchAllData('stacks'),
    });
    return(
        <DefaultLayout>
            {isLoading && <Loader />}
            {error && <p>There's an error {(error as Error).message}</p>}
            {Stacks && <StackDataTable table_name="stacks" data={Stacks}/>}
        </DefaultLayout>
    )
}