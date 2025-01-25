import React, { useEffect, useState } from "react";
import DefaultLayout from "../Layouts/DefaultLayout";
import SelectGroup from "./SelectGroup";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAllData, fetchSingleRecord } from "@/services/dataOperations";
import { put } from "@vercel/blob";
import MultipleSelectGroup from "./MultipleSelectGroup";
import { Stack } from "@/interfaces/Stack";

interface ProjectFormProp {
  method : string;
}

export const ProjectForm : React.FC<ProjectFormProp> = ({method}) => {
  const [stackData, setStackData] = useState<Stack[]>([]);
  const { proj_id } = useParams<{ proj_id: string }>();

  const isUpdate = method === "update";
  
  useEffect(() => {
    const loadProjects = async () => {
        try{
            const data = await fetchAllData('stacks');
            console.log(data)
            setStackData(data);
            console.log(data);
        }
        catch (error){
            console.error(error)
        }
    };

    loadProjects();
  }, [])

  const navigate = useNavigate();

  const handleSubmit = async (e : React.FormEvent) => {
    e.preventDefault();

    const apiUrl = isUpdate
    ? `http://localhost:3000/api/project/${proj_id}`
    : "http://localhost:3000/api/project/";
    const payload = Object.fromEntries(
      Object.entries(ProjectData).filter(([key, value]) => value)
    );
    console.log('Project Payload:', JSON.stringify(payload));
    try {
      const response = await fetch(apiUrl, {
        method: isUpdate ? 'PATCH' : 'POST',
        headers : {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log('Response Status:', response.status);
      
      const result = await response.json();
      console.log('Project API Response:', result);

      if (response.ok) {
        alert(isUpdate ? "Project updated successfully" : "Project added successfully");
        navigate("/projects");
      } else {
        alert(`Failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing the request.");
    }
  }

  const handleLogoUpload = async (file: File) => {
    try {
      const res = await put(file.name, file, {
        access: 'public',
        token: import.meta.env.VITE_BLOB_READ_WRITE_TOKEN
      });
      setProjectData((prevData) => ({
        ...prevData, logo: res.url
      }));
    } catch (error) {
      console.error("Error uploading project image : ", error)
      console.log(error)
      alert("Failed to upload project image, please try again")
    }
  }

  const [ProjectData, setProjectData] = useState({
    proj_name: "",
    proj_img: "",
    category: "",
    description: "",
    github: "",
    hosting: "",
  });


  const handleCategoryChange = (value: string) => {
    setProjectData({
      ...ProjectData,
      category: value, 
    });
  };

  useEffect(() => {
    if (isUpdate && proj_id) {
      fetchSingleRecord(Number(proj_id), "project").then((data) => {
        if (data) {
          setProjectData(data);
          console.log(data)
        }
      });
    }
  }, [proj_id, isUpdate]);
  return (
      <DefaultLayout> 
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Project {method} form
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Project Name <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter the stack name"
                  value={ProjectData.proj_name}
                  onChange={(e) => {
                    setProjectData({
                      ...ProjectData, 
                      proj_name : e.target.value
                    })
                  }}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="The color of the element when you hover over it"
                  value={ProjectData.description}
                  onChange={(e) => {
                    setProjectData({
                      ...ProjectData, description : e.target.value
                    })
                  }}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Github Repo Url
                </label>
                <input
                  type="text"
                  placeholder="Where would you want the element to redirect?"
                  value={ProjectData.github}
                  onChange={(e) => {
                    setProjectData({
                      ...ProjectData, 
                      github : e.target.value
                    })
                  }}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Web Hosting Url
                </label>
                <input
                  type="text"
                  placeholder="Where would you want the element to redirect?"
                  value={ProjectData.hosting}
                  onChange={(e) => {
                    setProjectData({
                      ...ProjectData, 
                      hosting : e.target.value
                    })
                  }}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Stacks Used
                </label>
                <MultipleSelectGroup id="multiselect" data={stackData}/>
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Category
                </label>
                <SelectGroup table_name="project" onChange={handleCategoryChange}/>
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Logo
                </label>
                <input
                type="file"
                className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:px-2.5 file:py-1 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
              />
              </div>

              {/* <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Message
                </label>
                <textarea
                  rows={6}
                  placeholder="Type your message"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div> */}

            <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
              {isUpdate ? 'Update':'Add'}
            </button>
            </div>
          </form>
        </div>
        </DefaultLayout>
    )
}