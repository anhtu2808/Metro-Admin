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
//  - User API -
export const updateUserAPI = async (id, payload) => {
  const res = await api.put(`/v1/users/${id}`, payload);
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

//  - Station API -
export const getAllStationsAPI = async (params = {}) => {
  const { page = 1, size = 10, search = '' } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...(search && { search })
  });
  
  const res = await api.get(`/v1/stations?${queryParams}`);
  return res.data;
};

export const getStationByIdAPI = async (id) => {
  const res = await api.get(`/v1/stations/${id}`);
  return res.data;
};

export const createStationAPI = async (payload) => {
  const res = await api.post("/v1/stations", payload);
  return res.data;
};

export const updateStationAPI = async (id, payload) => {
  const res = await api.put(`/v1/stations/${id}`, payload);
  return res.data;
};

export const deleteStationAPI = async (id) => {
  const res = await api.delete(`/v1/stations/${id}`);
  return res.data;
};

//  - Line API -
export const getAllLinesAPI = async () => {
  const res = await api.get("/v1/lines");
  return res.data;
};
//  - Image API -
export const uploadProfileImageAPI = async (image) => {
  const res = await api.post("/v1/uploads/users", image);
  return res.data;
};

export const uploadStationImageAPI = async (image) => {
  const res = await api.post("/v1/uploads/stations", image);
  return res.data;
};


export const uploadContentImageAPI = async (image) => {
  const res = await api.post("/v1/uploads/contents", image);
  return res.data;
};

