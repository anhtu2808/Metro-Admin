import api from "../services/api";

//  - Auth API -
export const loginAPI = async (username, password) => {
  const res = await api.post("/v1/auth/login", { username, password });
  return res.data;
};

export const refreshTokenAPI = async (oldToken) => {
  const res = await api.post("/v1/auth/refresh", { token: oldToken });
  return res.data;
};

export const getMyInfoAPI = async () => {
  const res = await api.get("/v1/users/my-info");
  return res.data;
};

//  - Role API -
export const fetchRolesAPI = async () => {
  const res = await api.get("/v1/roles");
  return res.data;
};

export const updateRoleAPI = async (id, data) => {
  const res = await api.put(`/v1/roles/${id}`, data);
  return res.data;
};
//  - Permission API -

export const fetchPermissionsAPI = async () => {
  const res = await api.get("/v1/permissions");
  return res.data;
};

export const createPermissionAPI = async (payload) => {
  const res = await api.post("/v1/permissions", payload);
  return res.data;
};

export const updatePermissionAPI = async (id, data) => {
  const res = await api.put(`/v1/permissions/${id}`, data);
  return res.data;
};