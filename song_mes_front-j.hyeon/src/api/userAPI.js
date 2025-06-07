import axios from "./axios";

export const getUserNames = () => axios.get("/api/user/names");
