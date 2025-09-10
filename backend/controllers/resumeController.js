import fs from 'fs';
import path from 'path';
import Resume from '../models/Resume.js';

export const createResume = async (req, res) => {
    try {
        const { title } = req.body;

        // Default template
        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: '',
                },
            ],
            interests: [''],
        };

        const newResume = await Resume.create({
            userId: req.user.id,
            title,
            ...defaultResumeData,
        });

        res.status(201).json(newResume);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create resume', error: error.message });
    }
};

export const getUserResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user.id }).sort({
            updatedAt: -1,
        });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get resumes', error: error.message });
    }
};

export const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.json(resume);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get resume', error: error.message });
    }
};

export const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found or unauthorized' });
        }

        // Merge updates from req.body into existing resume
        Object.assign(resume, req.body);

        // Save updated resume
        const savedResume = await resume.save();
        res.json(savedResume);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update resume', error: error.message });
    }
};

export const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found or unauthorized' });
        }

        // Folder where uploads are stored
        const uploadsFolder = path.join(process.cwd(), 'uploads');

        // Delete thumbnail image
        if (resume.thumbnailLink) {
            const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
            if (fs.existsSync(oldThumbnail)) {
                fs.unlinkSync(oldThumbnail);
            }
        }

        // Delete profile preview image
        if (resume.profileInfo?.profilePreviewUrl) {
            const oldProfile = path.join(
                uploadsFolder,
                path.basename(resume.profileInfo.profilePreviewUrl)
            );
            if (fs.existsSync(oldProfile)) {
                fs.unlinkSync(oldProfile);
            }
        }

        // Delete the resume document
        const deleted = await Resume.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Resume not found or unauthorized' });
        }

        res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete resume', error: error.message });
    }
};

// Export resume (JSON for now; PDF can be added later)
export const exportResume = async (req, res) => {
    try {
        const { id } = req.params;
        const { format: exportFormat = 'json' } = req.query;

        const resume = await Resume.findOne({ _id: id, userId: req.user.id });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found or unauthorized' });
        }

        if (exportFormat.toLowerCase() !== 'json') {
            return res.status(501).json({ message: 'PDF export not enabled yet. Use ?format=json' });
        }

        const safeTitle = (resume.title || 'resume').replace(/[^a-z0-9\-_]+/gi, '_').toLowerCase();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').replace('Z', '');
        const filename = `${safeTitle}_${timestamp}.json`;

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.status(200).send(JSON.stringify(resume, null, 2));
    } catch (error) {
        return res.status(500).json({ message: 'Failed to export resume', error: error.message });
    }
};

// POST /api/resume/export → stream a PDF generated from provided resume data
// Body: { resume: { title, profileInfo, contactInfo, workExperience, education, skills, projects, certifications, languages, interests } }
export const exportResumePdf = async (req, res) => {
    try {
        const { resume } = req.body || {};
        if (!resume) {
            return res.status(400).json({ message: 'Missing resume data in request body' });
        }

        let PDFDocument;
        try {
            ({ default: PDFDocument } = await import('pdfkit'));
        } catch (_err) {
            return res.status(501).json({
                message: 'PDF export not available. Please install pdfkit in backend: npm install pdfkit',
            });
        }

        const safeTitle = (resume.title || 'resume').replace(/[^a-z0-9\-_]+/gi, '_').toLowerCase();
        const filename = `${safeTitle}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        doc.pipe(res);

        // Title
        doc.fontSize(20).text(resume.title || 'Resume', { align: 'center' });
        doc.moveDown(0.5);

        // Profile / Name & Designation
        const name = resume.profileInfo?.fullName || '';
        const designation = resume.profileInfo?.designation || '';
        if (name) doc.fontSize(16).text(name, { align: 'center' });
        if (designation) doc.fontSize(12).fillColor('#555').text(designation, { align: 'center' });
        doc.moveDown();
        doc.fillColor('#000');

        // Contact
        const c = resume.contactInfo || {};
        const contacts = [c.email, c.phone, c.location, c.linkedin, c.github, c.website]
            .filter(Boolean)
            .join('  |  ');
        if (contacts) {
            doc.fontSize(10).text(contacts, { align: 'center' });
            doc.moveDown();
        }

        const section = (title) => {
            doc.moveDown(0.5);
            doc.fontSize(13).text(title, { underline: true });
            doc.moveDown(0.25);
        };

        // Summary
        if (resume.profileInfo?.summary) {
            section('Summary');
            doc.fontSize(11).text(resume.profileInfo.summary);
        }

        // Work Experience
        if (Array.isArray(resume.workExperience) && resume.workExperience.length) {
            section('Work Experience');
            resume.workExperience.forEach((w) => {
                const header = [w.role, w.company].filter(Boolean).join(' at ');
                const dates = [w.startDate, w.endDate].filter(Boolean).join(' - ');
                if (header) doc.fontSize(11).text(header, { continued: !!dates });
                if (dates) doc.fontSize(10).fillColor('#555').text(`  (${dates})`);
                doc.fillColor('#000');
                if (w.description) doc.fontSize(10).text(w.description);
                doc.moveDown(0.5);
            });
        }

        // Education
        if (Array.isArray(resume.education) && resume.education.length) {
            section('Education');
            resume.education.forEach((e) => {
                const header = [e.degree, e.institution].filter(Boolean).join(' - ');
                const dates = [e.startDate, e.endDate].filter(Boolean).join(' - ');
                if (header) doc.fontSize(11).text(header);
                if (dates) doc.fontSize(10).fillColor('#555').text(dates);
                doc.fillColor('#000');
                doc.moveDown(0.5);
            });
        }

        // Skills
        if (Array.isArray(resume.skills) && resume.skills.length) {
            section('Skills');
            const skills = resume.skills.map((s) => (typeof s === 'string' ? s : s.name)).filter(Boolean);
            if (skills.length) doc.fontSize(11).text(skills.join(', '));
        }

        // Projects
        if (Array.isArray(resume.projects) && resume.projects.length) {
            section('Projects');
            resume.projects.forEach((p) => {
                if (p.title) doc.fontSize(11).text(p.title);
                if (p.description) doc.fontSize(10).text(p.description);
                const links = [p.github, p.liveDemo].filter(Boolean).join(' | ');
                if (links) doc.fontSize(10).fillColor('#555').text(links);
                doc.fillColor('#000');
                doc.moveDown(0.5);
            });
        }

        // Certifications
        if (Array.isArray(resume.certifications) && resume.certifications.length) {
            section('Certifications');
            resume.certifications.forEach((c) => {
                const line = [c.title, c.issuer, c.year].filter(Boolean).join(' - ');
                if (line) doc.fontSize(11).text(line);
            });
        }

        // Languages
        if (Array.isArray(resume.languages) && resume.languages.length) {
            section('Languages');
            const langs = resume.languages.map((l) => (typeof l === 'string' ? l : l.name)).filter(Boolean);
            if (langs.length) doc.fontSize(11).text(langs.join(', '));
        }

        // Interests
        if (Array.isArray(resume.interests) && resume.interests.length) {
            section('Interests');
            const ints = resume.interests.filter(Boolean);
            if (ints.length) doc.fontSize(11).text(ints.join(', '));
        }

        doc.end();
    } catch (error) {
        return res.status(500).json({ message: 'Failed to export PDF', error: error.message });
    }
};

// POST /api/resume/analyze → uses OpenAI if available
export const analyzeResume = async (req, res) => {
    const { resumeText, jobDescription } = req.body || {};
    if (!resumeText) return res.status(400).json({ message: 'resumeText is required' });
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(501).json({
                message: 'AI analysis not configured. Set OPENAI_API_KEY to enable.',
            });
        }

        let OpenAI;
        try {
            ({ default: OpenAI } = await import('openai'));
        } catch (_err) {
            return res.status(501).json({ message: 'Install openai package in backend to enable analysis' });
        }

        const client = new OpenAI({ apiKey });
        const completion = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are an ATS resume analyzer. Provide concise, actionable feedback.' },
                {
                    role: 'user',
                    content: `Analyze this resume against the job description:\nResume: ${resumeText}\nJob Description: ${jobDescription || ''}\n\nReturn as a concise report:\n1. Grammar issues\n2. ATS Score (0-100)\n3. Missing keywords\n4. Suggestions for improvement`,
                },
            ],
            temperature: 0.2,
            max_tokens: 500, // Limit response length for faster processing
        });
        const analysis = completion?.choices?.[0]?.message?.content || 'No analysis generated.';
        return res.json({ analysis });
    } catch (error) {
        console.error('AI Analysis Error:', error);
        
        // Handle specific timeout errors
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            return res.status(408).json({ 
                message: 'AI analysis timed out. Please try again with a shorter resume or job description.' 
            });
        }
        
        // Handle OpenAI API errors
        if (error.status === 429) {
            return res.status(429).json({ 
                message: 'AI service is busy. Please try again in a few minutes.' 
            });
        }
        
        return res.status(500).json({ 
            message: 'Failed to analyze resume', 
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// POST /api/resume/analyze-upload (multipart) → extract text from PDF/DOCX and analyze
export const analyzeResumeUpload = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        const mimetype = file.mimetype;
        let text = '';

        if (mimetype === 'application/pdf') {
            try {
                let pdfParse;
                try {
                    const mod = await import('pdf-parse');
                    pdfParse = mod?.default || mod;
                } catch (esmErr) {
                    const { createRequire } = await import('module');
                    const require = createRequire(import.meta.url);
                    // eslint-disable-next-line global-require
                    pdfParse = require('pdf-parse');
                }
                const data = await pdfParse(file.buffer);
                text = data.text || '';
            } catch (_err) {
                return res.status(501).json({ message: 'Install pdf-parse in backend to analyze PDFs' });
            }
        } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            try {
                let mammothLib;
                try {
                    mammothLib = await import('mammoth');
                } catch (esmErr) {
                    const { createRequire } = await import('module');
                    const require = createRequire(import.meta.url);
                    // eslint-disable-next-line global-require
                    mammothLib = require('mammoth');
                }
                const result = await mammothLib.extractRawText({ buffer: file.buffer });
                text = result.value || '';
            } catch (_err) {
                return res.status(501).json({ message: 'Install mammoth in backend to analyze DOCX' });
            }
        } else {
            return res.status(400).json({ message: 'Unsupported file type' });
        }

        req.body.resumeText = text;
        // Ensure jobDescription is forwarded whether provided as query or body
        if (!req.body.jobDescription && req.query?.jobDescription) {
            req.body.jobDescription = req.query.jobDescription;
        }
        return analyzeResume(req, res);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to analyze uploaded resume', error: error.message });
    }
};
