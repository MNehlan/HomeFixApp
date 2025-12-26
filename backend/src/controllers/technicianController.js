import { db } from "../config/firebase.js"

export const applyTechnician = async (req, res) => {
  const { category, price, experience, bio = "", city = "", photoUrl, certificateUrl, mobile = "", isAvailable = true } = req.body

  await db
    .collection("technicians")
    .doc(req.user.uid)
    .set(
      {
        category: category || "",
        price: Number(price) || 0,
        experience: experience || "",
        bio,
        mobile,
        city: city.toLowerCase(), // Save normalized for easier search
        certificateUrl: certificateUrl || "",
        averageRating: 0,
        totalReviews: 0,
        updatedAt: new Date(),
        isAvailable: isAvailable !== undefined ? isAvailable : true,
      },
      { merge: true }
    )

  const roles = Array.from(new Set([...(req.user.roles || []), "technician"]))

  const userUpdates = {
    role: "technician",
    technicianStatus: "PENDING",
    roles,
  }

  if (photoUrl) {
    userUpdates.profilePic = photoUrl
  }

  if (mobile) {
    userUpdates.mobile = mobile
  }

  await db.collection("users").doc(req.user.uid).update(userUpdates)

  res.json({ message: "Technician application submitted", status: "PENDING" })
}

export const updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body

    await db.collection("technicians").doc(req.user.uid).update({
      isAvailable,
      updatedAt: new Date(),
    })

    res.json({ message: "Availability updated", isAvailable })
  } catch (error) {
    console.error("Update availability error", error)
    res.status(500).json({ message: "Failed to update availability" })
  }
}

export const getTechnicianProfile = async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.user.uid)
    const userSnap = await userRef.get()

    if (!userSnap.exists) {
      return res.status(404).json({ message: "User not found" })
    }

    if (!userSnap.data().roles?.includes("technician")) {
      return res.status(403).json({ message: "Not a technician" })
    }

    const techSnap = await db.collection("technicians").doc(req.user.uid).get()
    if (!techSnap.exists) {
      return res.status(404).json({ message: "Technician profile missing" })
    }

    res.json({
      uid: req.user.uid,
      technicianStatus: userSnap.data().technicianStatus,
      name: userSnap.data().name,
      email: userSnap.data().email,
      profilePic: userSnap.data().profilePic || "",
      mobile: userSnap.data().mobile || "",
      mobile: userSnap.data().mobile || "",
      isAvailable: techSnap.data().isAvailable !== false, // Default to true if missing
      ...techSnap.data(),
    })
  } catch (error) {
    console.error("Technician profile error", error)
    res.status(500).json({ message: "Failed to load technician profile" })
  }
}

export const getTechnicianCities = async (_req, res) => {
  try {
    const snapshot = await db.collection("technicians").get();
    const cities = new Set();
    snapshot.forEach((doc) => {
      const city = doc.data().city;
      if (city) {
        cities.add(city.toLowerCase()); // Normalize
      }
    });

    // Capitalize for display
    const formattedCities = Array.from(cities).map(c => c.charAt(0).toUpperCase() + c.slice(1));
    res.json(formattedCities);
  } catch (error) {
    console.error("Cities fetch error", error);
    res.status(500).json({ message: "Failed to load cities" });
  }
};

export const getTechnicianCategories = async (_req, res) => {
  try {
    const snapshot = await db.collection("technicians").get();
    const categories = new Set();

    // Add common categories by default
    const commonCategories = ["Electrician", "Plumber", "Carpenter", "Painter", "AC Repair", "Appliance Repair", "House Cleaning"];
    commonCategories.forEach(c => categories.add(c.toLowerCase()));

    snapshot.forEach((doc) => {
      const category = doc.data().category;
      if (category) {
        categories.add(category.toLowerCase());
      }
    });

    // Format: Capitalize words
    const formattedCategories = Array.from(categories).map(c =>
      c.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    ).sort();

    res.json(formattedCategories);
  } catch (error) {
    console.error("Categories fetch error", error);
    res.status(500).json({ message: "Failed to load categories" });
  }
};
