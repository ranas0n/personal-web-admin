const API_URL = `http://localhost:3000/api`;

export const getRowCount = async (table: string) => {
  const url = `${API_URL}/row-count/${table}`;
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch from ${url}. Status: ${res.status}`);
    }

    const rowNum = await res.json();
    return rowNum;
  } catch (error) {
    console.error(`Error fetching row count from ${url}:`, error);
    throw error;
  }
};

export const fetchAllData = async (url_path: string) => {
  try {
    const url = `${API_URL}/${url_path}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch ${url_path} data. Status: ${res.status}`
      );
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error in fetchAllData for ${url_path}:`, error);
    throw error;
  }
};

export const fetchSingleRecord = async (id: number, url_path: string) => {
  if (!id) {
    throw new Error("ID must be provided");
  }
  if (url_path !== "project" && url_path !== "stack") {
    throw new Error("You can only get data from stack or project URL");
  }

  try {
    const url = `${API_URL}/${url_path}/${id}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(
        `Failed to fetch ${url_path} data. Status: ${res.status}`
      );
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error in fetchSingleRecord for ${url_path}/${id}:`, error);
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
    if (!response.ok) {
      throw new Error(`Failed to delete record. Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting ${url_path}/${id}:`, error);
    throw error;
  }
};

export const deleteBlobImage = async (
  blobURL: string,
  table: string,
  recordId: string | undefined
) => {
  if (!blobURL || !table || !recordId) {
    throw new Error("Blob URL, table, and record ID are required");
  }

  const encodedURL = encodeURIComponent(blobURL);
  const url = `${API_URL}/blob/${encodedURL}-${table}-${recordId}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete image. Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting blob image:`, error);
    throw error;
  }
};
