import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000/api", // ✅ backend base route
  withCredentials: false, // no cookies for now
});
