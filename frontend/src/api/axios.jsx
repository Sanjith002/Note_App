import Axios from "axios";

const axios = Axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export default axios;