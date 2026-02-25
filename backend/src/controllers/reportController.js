import { db } from "../config/firebase.js";

export const createReport = async (req, res) => {
  try {
    const { reportedUserId, reason, details, jobId } = req.body;
    const reporterId = req.user.uid;

    if (!reportedUserId || !reason) {
      return res.status(400).json({ message: "Reported user and reason are required" });
    }

    const reportData = {
      reporterId,
      reportedUserId,
      reason,
      details: details || "",
      jobId: jobId || null,
      status: "OPEN",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const reportRef = await db.collection("reports").add(reportData);
    res.status(201).json({ id: reportRef.id, message: "Report submitted successfully" });
  } catch (error) {
    console.error("Create report error:", error);
    res.status(500).json({ message: "Failed to submit report" });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const snapshot = await db.collection("reports").orderBy("createdAt", "desc").get();
    const reports = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Fetch details of reporter and reported user
      const [reporterSnap, reportedSnap] = await Promise.all([
        db.collection("users").doc(data.reporterId).get(),
        db.collection("users").doc(data.reportedUserId).get()
      ]);

      reports.push({
        id: doc.id,
        ...data,
        reporter: reporterSnap.exists ? { name: reporterSnap.data().name, email: reporterSnap.data().email } : null,
        reportedUser: reportedSnap.exists ? { name: reportedSnap.data().name, email: reportedSnap.data().email } : null,
      });
    }

    res.json(reports);
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

export const resolveReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!["OPEN", "RESOLVED", "DISMISSED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await db.collection("reports").doc(id).update({
      status,
      adminNotes: adminNotes || "",
      resolvedAt: new Date(),
      updatedAt: new Date(),
    });

    res.json({ message: `Report marked as ${status}` });
  } catch (error) {
    console.error("Resolve report error:", error);
    res.status(500).json({ message: "Failed to update report status" });
  }
};
