import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function useQCards(initialData) {
  const [data, setData] = useState(initialData || []);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setData([]);
    setRefresh(!refresh);
  };

  const getInitial = async () => {
    const token = Cookies.get("token");

    if (!token) {
      setData([]);
      setError("No token found. Please log in.");
      return [];
    }

    try {
      const response = await axios.get("http://localhost:3000/QCards", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to load data.";
      setError(errorMessage);
      console.error("Error fetching initial data:", err);
      return [];
    }
  };

  useEffect(() => {
    if (!initialData) {
      getInitial();
    }
  }, [initialData]);

  useEffect(() => {
    console.log("refresh");
    getInitial();
  }, [refresh]);

  return {
    data,
    error,
    handleRefresh,
  };
}

export default useQCards;
