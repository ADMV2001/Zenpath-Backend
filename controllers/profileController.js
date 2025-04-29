// controllers/profileController.js
import Patient from "../models/patientModel.js";
import BasicInfo from "../models/basicInfoModel.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const patient = await Patient.findById(userId).lean();
    const basicInfo = await BasicInfo.findOne({ userId }).lean();

    if (!patient) return res.status(404).json({ message: "User not found" });

    res.json({ patient, basicInfo });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};
