import api from "./api";

/**
 * Create a new service request
 */
export const createJob = async (data) => {
  const res = await api.post("/jobs", data);
  return res.data;
};

/**
 * Get jobs (based on user role)
 */
export const getJobs = async () => {
  const res = await api.get("/jobs");
  return res.data;
};

/**
 * Get a single job by ID
 */
export const getJobById = async (id) => {
  const res = await api.get(`/jobs/${id}`);
  return res.data;
};

/**
 * Update job status
 */
export const updateJobStatus = async (id, status) => {
  const res = await api.put(`/jobs/${id}/status`, { status });
  return res.data;
};
