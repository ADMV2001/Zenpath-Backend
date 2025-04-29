import BasicInfo from "../models/basicInfoModel.js";

export async function submitBasicInfo(req, res) {
  try {
    const { name, email, ...formData } = req.body;
    const userId = req.user?.id; // from auth middleware

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const newInfo = new BasicInfo({
      userId,
      name,
      email,
      ...formData
    });

    await newInfo.save();
    res.status(201).json({ message: "Basic info saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
