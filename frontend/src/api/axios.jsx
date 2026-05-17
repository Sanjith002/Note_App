import Axios from "axios";

const axios = Axios.create({
  baseURL: "https://note-app-w87y.onrender.com",
  withCredentials: true,
});

export default axios;