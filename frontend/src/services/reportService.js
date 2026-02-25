import api from "./api";

/**
 * Submit a report
 */
export const submitReport = async (data) => {
  const res = await api.post("/reports", data);
  return res.data;
};

/**
 * Get all reports (Admin only)
 */
export const getReports = async () => {
  const res = await api.get("/reports");
  return res.data;
};

/**
 * Resolve a report (Admin only)
 */
export const resolveReport = async (id, data) => {
  const res = await api.put(`/reports/${id}/resolve`, data);
  return res.data;
};
