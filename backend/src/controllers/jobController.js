import { db } from "../config/firebase.js";

// Create a new service request
export const createJob = async (req, res) => {
  try {
    const { technicianId, date, time, description } = req.body;
    const customerId = req.user.uid;

    if (!technicianId || !date || !time || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1. Verify Technician Exists & is Approved
    const technicianUserSnap = await db
      .collection("users")
      .doc(technicianId)
      .get();
    if (!technicianUserSnap.exists) {
      return res.status(404).json({ message: "Technician not found" });
    }

    const technicianData = technicianUserSnap.data();
    if (technicianData.technicianStatus !== "APPROVED") {
      return res
        .status(400)
        .json({ message: "Technician is not approved for services" });
    }

    // 2. Verify Technician Availability
    const technicianProfileSnap = await db
      .collection("technicians")
      .doc(technicianId)
      .get();
    if (
      !technicianProfileSnap.exists ||
      technicianProfileSnap.data().isAvailable === false
    ) {
      return res
        .status(400)
        .json({ message: "Technician is currently unavailable" });
    }

    // 3. Create Job
    const jobData = {
      customerId,
      technicianId,
      date,
      time,
      description,
      status: "REQUESTED", // Initial status
      createdAt: new Date(),
      updatedAt: new Date(),
      customerName: req.user.email, // Fallback/Basic info
      technicianName: technicianData.name || technicianData.email,
    };

    const jobRef = await db.collection("jobs").add(jobData);

    res
      .status(201)
      .json({ id: jobRef.id, message: "Service requested successfully" });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ message: "Failed to create service request" });
  }
};

// Get jobs based on user role
export const getJobs = async (req, res) => {
  try {
    const userId = req.user.uid;
    // Use data from authMiddleware to avoid re-fetching and potential crashes
    const userRole = req.user.role;
    const roles = req.user.roles || [];

    let query;

    const isAdmin = roles.includes("admin") || userRole === "admin";
    const isTechnician = roles.includes("technician");

    if (isAdmin) {
      query = db.collection("jobs");
    } else if (isTechnician) {
      query = db.collection("jobs").where("technicianId", "==", userId);
    } else {
      // Default to Customer
      query = db.collection("jobs").where("customerId", "==", userId);
    }

    // Remove orderBy from query to avoid "Index Required" error. 
    // Perform in-memory sorting instead.
    const snapshot = await query.get();

    const jobs = [];
    snapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() });
    });

    // Sort by createdAt desc
    jobs.sort((a, b) => {
       const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
       const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
       return dateB - dateA;
    });

    res.json(jobs);
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

// Get Single Job
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobSnap = await db.collection("jobs").doc(id).get();

    if (!jobSnap.exists) {
      return res.status(404).json({ message: "Job not found" });
    }

    const job = jobSnap.data();
    // Authorization check: Only Admin, or the specific Customer/Technician involved
    if (job.customerId !== req.user.uid && job.technicianId !== req.user.uid) {
      // Check admin
      const userSnap = await db.collection("users").doc(req.user.uid).get();
      const roles = userSnap.data().roles || [];
      if (!roles.includes("admin")) {
        return res
          .status(403)
          .json({ message: "Unauthorized access to this job" });
      }
    }

    res.json({ id: jobSnap.id, ...job });
  } catch (error) {
    console.error("Get job error:", error);
    res.status(500).json({ message: "Failed to fetch job" });
  }
};

// Update Job Status
export const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.uid;

    const jobRef = db.collection("jobs").doc(id);
    const jobSnap = await jobRef.get();

    if (!jobSnap.exists) {
      return res.status(404).json({ message: "Job not found" });
    }

    const job = jobSnap.data();
    const currentStatus = job.status;

    // Valid Transitions & Permissions
    // REQUESTED -> ACCEPTED (Technician only)
    // REQUESTED -> REJECTED (Technician only) -> Terminal
    // REQUESTED -> CANCELLED (Customer only) -> Terminal
    // ACCEPTED -> IN_PROGRESS (Technician only)
    // IN_PROGRESS -> COMPLETED (Technician only) -> Terminal

    let isValid = false;
    let updateData = { status, updatedAt: new Date() };

    // Technician Actions
    if (job.technicianId === userId) {
      if (currentStatus === "REQUESTED") {
        if (status === "ACCEPTED") {
          isValid = true;
          // SIDE EFFECT: Technician becomes UNAVAILABLE
          await db
            .collection("technicians")
            .doc(userId)
            .update({ isAvailable: false });
        } else if (status === "REJECTED") {
          isValid = true;
        }
      } else if (currentStatus === "ACCEPTED") {
        if (status === "IN_PROGRESS") isValid = true;
      } else if (currentStatus === "IN_PROGRESS") {
        if (status === "COMPLETED") {
          isValid = true;
          // SIDE EFFECT: Technician becomes AVAILABLE
          await db
            .collection("technicians")
            .doc(userId)
            .update({ isAvailable: true });
        }
      }
    }
    // Customer Actions
    else if (job.customerId === userId) {
      if (currentStatus === "REQUESTED" && status === "CANCELLED") {
        isValid = true;
      }
    }

    if (!isValid) {
      return res.status(400).json({
        message: `Invalid status transition from ${currentStatus} to ${status} for this user role.`,
      });
    }

    await jobRef.update(updateData);
    res.json({ message: `Job status updated to ${status}` });
  } catch (error) {
    console.error("Update job status error:", error);
    res.status(500).json({ message: "Failed to update job status" });
  }
};
