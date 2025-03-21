import React, { useEffect, useState } from "react";
import DefaultLayout from "../Layouts/DefaultLayout";
import SelectGroup from "./SelectGroup";
import { put } from '@vercel/blob';
import { deleteBlobImage, fetchSingleRecord } from "@/services/dataOperations";
import { useNavigate, useParams } from "react-router-dom";
import { BsTrash } from "react-icons/bs";

interface StackFormProp {
  method: string;
}

export const StackForm: React.FC<StackFormProp> = ({ method }) => {
  const { id } = useParams<{ id: string }>();
  const [logo, setLogo] = useState<File | null>(null);
  
  const [stackData, setStackData] = useState({
    name: "",
    logo: "",
    href: "",
    category: "",
  });
  
  const isUpdate = method === "update";
  
  const navigate = useNavigate();

  const handleSubmit = async (e : React.FormEvent) => {
    e.preventDefault();

    const apiUrl = isUpdate
    ? `http://localhost:3000/api/stack/${id}`
    : "http://localhost:3000/api/stack/";
    try {
      let updatedStackData = {...stackData};
      if (logo) {
        const res = await handleLogoUpload(logo);
        console.log('Logo uploaded successfully', res);
        if (res) updatedStackData.logo = res.url;
      }
      const response = await fetch(apiUrl, {
        method: isUpdate ? 'PATCH' : 'POST',
        headers : {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStackData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(isUpdate ? "Stack updated successfully" : "Stack added successfully");
        navigate("/stacks");
      } else {
        alert(`Failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing the request.");
    }

  }

  const handleCategoryChange = (value: string) => {
    setStackData({
      ...stackData,
      category: value,
    });
  };


  const handleLogoUpload = async (file: File) => {
    try {
      const res = await put(file.name, file, {
        access: 'public',
        token: import.meta.env.VITE_BLOB_READ_WRITE_TOKEN
      });

      return res;
    } catch (error) {
      console.error("Error uploading logo : ", error)
      console.log(error)
      alert("Failed to upload logo, please try again")
    }
  }

  useEffect(() => {
    if (isUpdate && id) {
      fetchSingleRecord(Number(id), "stack").then((data) => {
        if (data) {
          setStackData(data);
          console.log(data)
        }
      });
    }
  }, [id, isUpdate]);

  return (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Stack {method} form
          </h3>
        </div>
        <form 
          onSubmit={handleSubmit}
        >
          <div className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Stack Name <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter the stack name"
                value={stackData.name}
                onChange={(e) =>
                  setStackData({ ...stackData, name: e.target.value })
                }
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Href
              </label>
              <input
                type="text"
                placeholder="Where would you want the element to redirect?"
                value={stackData.href}
                onChange={(e) =>
                  setStackData({ ...stackData, href: e.target.value })
                }
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Category
              </label>
              <SelectGroup table_name="stack" onChange={handleCategoryChange}/>
            </div>

            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Logo
              </label>

              {stackData.logo &&
                <div className="flex flex-row p-5 m-3 items-end">
                <img src={stackData.logo} className="w-30 mx-4" alt="Logo Preview" />
                
                <a onClick={async () => deleteBlobImage(stackData.logo, "stacks", id)} className="flex w-10 h-10 justify-center cursor-pointer items-center rounded-full bg-orange-600 p-3 font-medium text-white hover:opacity-50">
                  <BsTrash />
                </a>
              </div>
              }
              <input
                type="file"
                id="image"
                name="image"
                className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:px-2.5 file:py-1 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setLogo(file);
                  }
                }}
              />
            </div>

            <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
              {isUpdate ? 'Update':'Add'}
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};
