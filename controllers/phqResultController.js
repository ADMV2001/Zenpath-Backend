// controllers/phqResultController.js
import PhqResult from "../models/phqResultModel.js";

export const submitPhqResult = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, email, answers, score, status } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const newResult = new PhqResult({
      userId,
      name,
      email,
      Q1: answers[0],
      Q2: answers[1],
      Q3: answers[2],
      Q4: answers[3],
      Q5: answers[4],
      Q6: answers[5],
      Q7: answers[6],
      Q8: answers[7],
      Q9: answers[8],
      score,
      status,
    });

    await newResult.save();
    res.status(201).json({ message: "PHQ-9 result saved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
