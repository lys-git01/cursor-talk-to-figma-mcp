import axios from "./axios";

/* 7.2.3.청구코드등록 H1014, BM-7203 */
export const getClaimCodeList = () => axios.get("/api/claim-code/list");
export const insertClaimCode = (data) => axios.post("/api/claim-code/insert", data);
export const updateClaimCode = (data) => axios.post("/api/claim-code/update", data);
export const deleteClaimCode = (id) => axios.delete(`/api/claim-code/delete/${id}`);