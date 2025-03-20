import Feedback from "../models/feedback.model.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const PYTHON_API_URL = process.env.FEEDBACK_SERVER;

//create a new feedback
const addFeedback = async (req, res) => {
  try {
    const { feedback, reportId } = req.body;
    const userId = req.user?.toString();

    if (!feedback || !userId || !reportId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Call Python API to get sentiment analysis
    const sentimentResponse = await axios.post(
      `${PYTHON_API_URL}/feedback`,
      { feedback }
    );
    const sentiment = sentimentResponse.data.prediction;

    // Call Python API to get category analysis
    const categoryResponse = await axios.post(
      `${PYTHON_API_URL}/category`,
      { feedback }
    );
    const category = categoryResponse.data.prediction;

    // Save feedback in MongoDB
    const newFeedback = new Feedback({
      feedback,
      userId,
      reportId,
      sentiment,
      category,
    });

    await newFeedback.save();

    res
      .status(201)
      .json({ message: "Feedback saved successfully", data: newFeedback });
  } catch (error) {
    console.error("Error processing feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//get all feedbacks

const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("userId");
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get feedbacks. Please try again.",
    });
  }
};

//get feedback by id
const getFeedbackById = async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const feedback = await Feedback.findById(feedbackId).populate("userId").populate("reportId");
    console.log(feedback);
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get feedback. Please try again.",
    });
  }
};

//update feedback by id
const updateFeedbackById = async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const { feedback, reportId } = req.body;
    const userId = req.user?.toString();

    if (!feedback || !userId || !reportId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Call Python API to get sentiment analysis
    const sentimentResponse = await axios.post(
      `${PYTHON_API_URL}/feedback`,
      { feedback }
    );
    const sentiment = sentimentResponse.data.prediction;

    // Call Python API to get category analysis
    const categoryResponse = await axios.post(
      `${PYTHON_API_URL}/category`,
      { feedback }
    );
    const category = categoryResponse.data.prediction;

    // Save feedback in MongoDB
    const updatedFeedback = {
      feedback,
      userId,
      reportId,
      sentiment,
      category,
    };

    await Feedback.findByIdAndUpdate(feedbackId, updatedFeedback, {
      new: true,
    });
    res
      .status(200)
      .j5son({ success: true, message: "Feedback updated successfully" });
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//delete feedback by id
const deleteFeedbackById = async (req, res) => {
  try {
    const feedbackId = req.params.id;
    await Feedback.findByIdAndDelete(feedbackId);
    res
      .status(200)
      .json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete feedback. Please try again.",
    });
  }

};

//get feedback by report id
const getFeedbackByReportId = async (req, res) => {
  try {
    const reportId = req.params.id;
    const feedback = await Feedback.findOne({ reportId: reportId });
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get feedback. Please try again.",
    });
  }
  
};

//get feedback by user id
const getFeedbackByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const feedback = await Feedback.find({ userId: userId });
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get feedback. Please try again.",
    });
  }
};

//get feedback by sentiment
const getFeedbackBySentiment = async (req, res) => {
  try {
    const sentiment = req.params.sentiment;
    const feedback = await Feedback.find({ sentiment: sentiment });
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get feedback. Please try again.",
    });
  }
};

//get feedback by category
const getFeedbackByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const feedback = await Feedback.find({ category: category });
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get feedback. Please try again.",
    });
  }
};

export default {
  addFeedback,
  getFeedbacks,
  getFeedbackById,
  updateFeedbackById,
  deleteFeedbackById,
  getFeedbackByReportId,
  getFeedbackByUserId,
  getFeedbackBySentiment,
  getFeedbackByCategory,
};
