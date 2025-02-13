// import { useNavigate } from "react-router-dom";

const API_URL = `http://localhost:3000/api`;

export const fetchAllData = async (url_path: string) => {
  try {
    const url = `${API_URL}/${url_path}`;
    console.log("Fetching from:", url);

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `Failed at fetching ${url_path} data. Status: ${res.status}`
      );
    }

    const data = await res.json();
    console.log("Fetched data:", data);
    return data;
  } catch (error) {
    console.error("Error in fetchAllData:", error);
    throw error;
  }
};

export const fetchSingleRecord = async (id: number, url_path: string) => {
  if (!id) console.log("You have to provide id");
  if (url_path !== "project" && url_path !== "stack")
    console.log("You can only get data from stack or project url");
  if (url_path === "projects" || url_path === "stacks")
    console.log(
      "Url stacks and project are for getting all the data, not the specific record"
    );

  try {
    const url = `${API_URL}/${url_path}/${id}`;
    console.log(`Fetching from : ${url}`);
    const res = await fetch(url);

    if (!res.ok)
      throw new Error(
        `Failed at fetching ${url_path} data. Status: ${res.status}`
      );

    const data = await res.json();
    console.log(`Fetched data : ${data}`);

    return data;
  } catch (error) {
    console.error("Error in fetchAllData:", error);
    throw error;
  }
};

export const handleDelete = async (
  id: number | undefined,
  url_path: string
) => {
  if (!id) return;
  const url = `${API_URL}/${url_path}/${id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (response.ok) {
      console.log("DELETED SUCCESFULLY");
    } else {
      console.log("Failed to Delete the Record");
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteBlobImage = async (
  blobURL: string,
  table: string,
  recordId: string | undefined
) => {
  if (!blobURL || !table || !recordId) return;

  const encodedURL = encodeURIComponent(blobURL);

  const url = `${API_URL}/blob/${encodedURL}-${table}-${recordId}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
    });

    console.log(response);

    if (response.ok) {
      console.log("IMAGE DELETED SUCCESFULLY.");
    } else {
      console.log("Failed to delete image");
    }
  } catch (error) {
    console.log(error);
  }
};
