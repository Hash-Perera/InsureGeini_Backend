import feedbackService from "../services/feedback.service.js";
import express from "express";

const router = express.Router();

router.post("/add", feedbackService.addFeedback); //create a new feedback
router.get("/all", feedbackService.getFeedbacks); //get all feedbacks
router.get("/:id", feedbackService.getFeedbackById); //get feedback by id
router.get("/user/:id", feedbackService.getFeedbackByUserId); //get feedback by user id
router.get("/sentiment/:sentiment", feedbackService.getFeedbackBySentiment); //get feedback by sentiment
router.get("/category/:category", feedbackService.getFeedbackByCategory); //get feedback by category
router.get("/report/:id", feedbackService.getFeedbackByReportId); //get feedback by report id
router.put("/:id", feedbackService.updateFeedbackById); //update feedback by id
router.delete("/:id", feedbackService.deleteFeedbackById); //delete feedback by id

export default router;
