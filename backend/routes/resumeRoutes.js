import express from "express";
import {
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume,
    exportResume,
    exportResumePdf,
    analyzeResume,
    analyzeResumeUpload,
} from "../controllers/resumeController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { uploadResumeImages } from "../controllers/uploadImages.js";
import multer from "multer";

const router = express.Router();

router.post("/", authenticateToken, createResume);
router.get("/", authenticateToken, getUserResumes);
router.get("/:id", authenticateToken, getResumeById);
router.put("/:id", authenticateToken, updateResume);
router.put("/upload-images/:id", authenticateToken, uploadResumeImages);
// Accept POST as well to be compatible with clients that send POST
router.post("/upload-images/:id", authenticateToken, uploadResumeImages);

// Export
router.get("/:id/export", authenticateToken, exportResume);
router.post("/export", authenticateToken, exportResumePdf);

// ATS analyze
router.post("/analyze", authenticateToken, analyzeResume);
router.post("/analyze-upload", authenticateToken, (req, res, next) => {
    const memoryUpload = multer({ storage: multer.memoryStorage() });
    return memoryUpload.single('file')(req, res, (err) => {
        if (err) return res.status(400).json({ message: 'File upload failed', error: err.message });
        return analyzeResumeUpload(req, res);
    });
});

router.delete("/:id", authenticateToken, deleteResume);

export default router;
