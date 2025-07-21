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

export const createUserAPI = async (payload) => {
  const res = await api.post("/v1/users", payload);
  return res.data;
};

export const deleteUserAPI = async (id) => {
  const res = await api.delete(`/v1/users/${id}`);
  return res.data;
};

export const getUserByRoleAPI = async (role) => {
  const res = await api.get(`/v1/users/role/${role}`);
  return res.data;
};

export const getAllUsersAPI = async (params = {}) => {
  const {
    page = 1,
    size = 10,
    sort = "id",
    role,
    deleted,
    username,
    email,
    search,
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: sort.toString(),
  });

  if (role) queryParams.append("role", role);
  if (deleted !== undefined && deleted !== "all")
    queryParams.append("deleted", deleted);
  if (username) queryParams.append("username", username);
  if (email) queryParams.append("email", email);
  if (search) queryParams.append("search", search);

  const res = await api.get(`/v1/users?${queryParams}`);
  return res.data;
};
export const unBanUserAPI = async (id) => {
  const res = await api.put(`/v1/users/${id}/unban`);
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
  const { page = 1, size = 10, search = "", sort = "id" } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: sort.toString(),
    ...(search && { search }),
  });

  const res = await api.get(`/v1/stations?${queryParams}`);
  return res.data;
};

export const getStationByIdAPI = async (id) => {
  const res = await api.get(`/v1/stations/${id}`);
  return res.data;
};

export const getStationsByLineIdAPI = async (lineId) => {
  const res = await api.get(`/v1/lines/${lineId}/start-stations`);
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
export const createLineAPI = async (payload) => {
  const res = await api.post("/v1/lines", payload);
  return res.data;
};

export const updateLineAPI = async (id, payload) => {
  const res = await api.put(`/v1/lines/${id}`, payload);
  return res.data;
};

export const deleteLineAPI = async (id) => {
  const res = await api.delete(`/v1/lines/${id}`);
  return res.data;
};
export const getLineByIdAPI = async (id) => {
  const res = await api.get(`/v1/lines/${id}`);
  return res.data;
};

export const getAllLinesAPI = async (params = {}) => {
  const { page = 1, size = 10, search = "" } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...(search && { search }),
  });
  const res = await api.get(`/v1/lines?${queryParams}`);
  return res.data;
};
export const addStationsToLineAPI = async (lineId, payload) => {
  const res = await api.post(`/v1/lines/${lineId}/stations`, payload);
  return res.data;
};

//  - Line Segment API -
export const updateLineSegmentAPI = async (segmentId, payload) => {
  const res = await api.put(`/v1/line-segments/${segmentId}`, payload);
  return res.data;
};

// - Content API -
export const getAllContentAPI = async () => {
  const res = await api.get("/v1/contents");
  return res.data;
};

export const createContentAPI = async (payload) => {
  const res = await api.post("/v1/contents", payload);
  return res;
};

export const updateContentAPI = async (id, payload) => {
  const res = await api.put(`/v1/contents/${id}`, payload);
  return res;
};

export const deleteContentAPI = async (id) => {
  const res = await api.delete(`/v1/contents/${id}`);
  return res;
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

// - Bus API -
export const getAllBusRoutesAPI = async () => {
  const res = await api.get("/v1/bus-routes");
  return res.data;
};

export const createBusRoutesAPI = async (payload) => {
  const res = await api.post("/v1/bus-routes", payload);
  return res.data;
};

export const updateBusRoutesAPI = async (id, payload) => {
  const res = await api.put(`/v1/bus-routes/${id}`, payload);
  return res.data;
};

export const deleteBusRoutesAPI = async (id) => {
  const res = await api.delete(`/v1/bus-routes/${id}`);
  return res.data;
};
//  - Ticket Type API -
export const createTicketTypeAPI = async (payload) => {
  const res = await api.post("/v1/ticket-types", payload);
  return res.data;
};

export const getTicketTypeByIdAPI = async (id) => {
  const res = await api.get(`/v1/ticket-types/${id}`);
  return res.data;
};
export const getAllTicketTypesAPI = async () => {
  const res = await api.get("/v1/ticket-types");
  return res.data;
};

export const updateTicketTypeAPI = async (id, payload) => {
  const res = await api.put(`/v1/ticket-types/${id}`, payload);
  return res.data;
};

export const deleteTicketTypeAPI = async (id) => {
  const res = await api.delete(`/v1/ticket-types/${id}`);
  return res.data;
};
// - Dynamic Price Master API -
export const createDynamicPriceMasterAPI = async (payload) => {
  const res = await api.post("/v1/dynamic-price-masters", payload);
  return res.data;
};

export const updateDynamicPriceMasterAPI = async (id, payload) => {
  const res = await api.put(`/v1/dynamic-price-masters/${id}`, payload);
  return res.data;
};

export const deleteDynamicPriceMasterAPI = async (id) => {
  const res = await api.delete(`/v1/dynamic-price-masters/${id}`);
  return res.data;
};

export const getDynamicPriceMasterAPI = async (id) => {
  const res = await api.get(`/v1/dynamic-price-masters/${id}`);
  return res.data;
};

export const getAllDynamicPriceMasterAPI = async (params = {}) => {
  const { page = 1, size = 10, search = "" } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...(search && { search }),
  });
  const res = await api.get(`/v1/dynamic-price-masters?${queryParams}`);
  return res.data;
};

// - Dynamic Price API -
export const getDynamicPriceByLineIdAPI = async (lineId) => {
  const res = await api.get(`/v1/dynamic-prices/${lineId}`);
  return res.data;
};

export const calculateDynamicPriceAPI = async (lineId) => {
  const res = await api.post(`/v1/dynamic-prices/calculate?lineId=${lineId}`);
  return res.data;
};

//  - Ticket Order API -
export const getAllTicketOrdersAPI = async (params = {}) => {
  const {
    page = 1,
    size = 10,
    sortBy = "id",
    userId,
    isStatic,
    isStudent,
    status,
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy: sortBy.toString(),
    ...(userId && { userId: userId.toString() }),
    ...(isStatic !== undefined && { isStatic: isStatic.toString() }),
    ...(isStudent !== undefined && { isStudent: isStudent.toString() }),
    ...(status && { status }),
  });

  const res = await api.get(`/v1/ticket-orders?${queryParams}`);
  return res.data;
};
export const getTicketOrderByIdAPI = async (id) => {
  const res = await api.get(`/v1/ticket-orders/${id}`);
  return res.data;
};
export const createTicketOrderAPI = async (payload) => {
  const res = await api.post("/v1/ticket-orders", payload);
  return res.data;
};
export const updateTicketOrderAPI = async (id, payload) => {
  const res = await api.put(`/v1/ticket-orders/${id}`, payload);
  return res.data;
};
export const deleteTicketOrderAPI = async (id) => {
  const res = await api.delete(`/v1/ticket-orders/${id}`);
  return res.data;
};

export const getTicketOrderByTokenAPI = async (token) => {
  const res = await api.get(`/v1/scanner/ticket-orders/by-token/${token}`);
  return res.data;
};

// - Scanner API -
export const validateTicketAPI = async (payload) => {
  const res = await api.post(`/v1/scanner/validate`, payload);
  return res.data;
};
