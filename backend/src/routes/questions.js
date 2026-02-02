import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all questions with optional filtering
router.get('/', async (req, res) => {
    try {
        const { semester, subject, topic, search } = req.query;

        const where = {};

        if (semester) {
            where.semester = parseInt(semester);
        }

        if (subject) {
            where.subject = subject;
        }

        if (topic) {
            where.topic = topic;
        }

        if (search) {
            where.OR = [
                { questionName: { contains: search, mode: 'insensitive' } },
                { topic: { contains: search, mode: 'insensitive' } },
                { subject: { contains: search, mode: 'insensitive' } }
            ];
        }

        const questions = await prisma.question.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        res.json(questions);
    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// Get unique subjects and topics for filtering
router.get('/filters', async (req, res) => {
    try {
        const { semester } = req.query;

        const where = semester ? { semester: parseInt(semester) } : {};

        const questions = await prisma.question.findMany({
            where,
            select: {
                subject: true,
                topic: true
            }
        });

        const subjects = [...new Set(questions.map(q => q.subject))];
        const topics = [...new Set(questions.map(q => q.topic))];

        res.json({ subjects, topics });
    } catch (error) {
        console.error('Get filters error:', error);
        res.status(500).json({ error: 'Failed to fetch filters' });
    }
});

// Create new question (admin only)
router.post('/', authenticateAdmin, async (req, res) => {
    try {
        const { questionName, subject, topic, link, semester, year, courseId } = req.body;

        if (!questionName || !subject || !topic || !link) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const question = await prisma.question.create({
            data: {
                questionName,
                subject,
                topic,
                link,
                semester: semester || 4,
                year: year ? parseInt(year) : null,
                courseId: courseId || null
            }
        });

        res.status(201).json(question);
    } catch (error) {
        console.error('Create question error:', error);
        res.status(500).json({ error: 'Failed to create question' });
    }
});

// Update question (admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { questionName, subject, topic, link, semester, year, courseId } = req.body;

        const question = await prisma.question.update({
            where: { id },
            data: {
                questionName,
                subject,
                topic,
                link,
                semester,
                year: year ? parseInt(year) : null,
                courseId: courseId || null
            }
        });

        res.json(question);
    } catch (error) {
        console.error('Update question error:', error);
        res.status(500).json({ error: 'Failed to update question' });
    }
});

// Delete question (admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.question.delete({
            where: { id }
        });

        res.json({ success: true, message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Delete question error:', error);
        res.status(500).json({ error: 'Failed to delete question' });
    }
});

export default router;
