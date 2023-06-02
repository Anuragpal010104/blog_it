import axios from "axios";

const BASEURL = import.meta.env.VITE_BASE_URL || "http://localhost:8080";

const instance = axios.create({
  baseURL: BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export { instance };
