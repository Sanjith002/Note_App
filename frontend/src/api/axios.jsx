import Axios from "axios";

const axios = Axios.create({
  baseURL: "https://note-app-1-xwg7.onrender.com",
  withCredentials: true,
});

export default axios;