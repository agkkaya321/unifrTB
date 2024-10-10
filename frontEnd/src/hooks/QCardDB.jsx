import axios from "axios";
import Cookies from "js-cookie"; // Use js-cookie to manage cookies

// Create an instance of axios with default settings
const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios request interceptor to dynamically include the token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to delete a question by its ID
export async function deleteQuestion(questionId) {
  try {
    const response = await apiClient.delete(`/Question/${questionId}`);
    console.log("Delete successful:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to delete the question:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Function to post a new CQ
export async function postCQ(cardData) {
  try {
    const response = await apiClient.post("/CQ", cardData);
    return response.data;
  } catch (error) {
    console.error("Failed to post CQ:", error.response?.data || error.message);
    throw error;
  }
}

export async function insertQuestions(listid, q) {
  try {
    if (!listid || !q) {
      throw new Error("listid and q must be provided.");
    }
    const response = await apiClient.post("/Question", { listid, q });
    return response.data;
  } catch (error) {
    console.error(
      "Failed to post questions:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function deleteQCardDB(qcard) {
  try {
    const response = await apiClient.delete(`/CQ/${qcard.id}`, {});
    console.log("Dete successful:", response.data);
    return response.data;
  } catch (error) {
    // More robust error handling
    console.error(
      "Failed to delete QCard:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function changeTitle(title, id) {
  try {
    // Correcting the endpoint path and passing the id properly
    const response = await apiClient.patch(`/Title`, {
      // Passing title in the request body
      title: title,
      id: id,
    });
    console.log("Title update successful:", response.data);
    return response.data;
  } catch (error) {
    // More robust error handling with corrected message
    console.error(
      "Failed to change title:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function changeQ(q, id) {
  try {
    // Correcting the endpoint path and passing the id properly
    const response = await apiClient.patch(`/Question`, {
      // Passing title in the request body
      question: q,
      id: id,
    });
    console.log("Title update successful:", response.data);
    return response.data;
  } catch (error) {
    // More robust error handling with corrected message
    console.error(
      "Failed to change title:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function startNewTable(id) {
  const response = await apiClient.post(`/newTable`, { id: id });
  console.log(response);
  alert("Display code: " + response.data.id);
}
