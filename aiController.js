import FAQ from '../models/FAQ.js';
import { generateFAQ, generateAnswer } from '../services/aiService.js';

export const generateFAQController = async (req, res, next) => {
  try {
    const { topic, save = false } = req.body;
    if (!topic) return res.status(400).json({ success: false, message: 'topic is required' });
    const generated = await generateFAQ(topic);
    let savedFAQ = null;
    if (save === true) savedFAQ = await FAQ.create({ ...generated, createdBy: req.user._id, published: false });
    res.json({ success: true, generated, savedFAQ });
  } catch (error) { next(error); }
};

export const answerQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ success: false, message: 'question is required' });
    const regex = new RegExp(question.split(/\s+/).slice(0, 5).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');
    const contextFAQs = await FAQ.find({ published: true, $or: [{ question: regex }, { answer: regex }] }).limit(5).select('question answer category');
    const context = contextFAQs.map(x => `[${x.category}] Q: ${x.question}\nA: ${x.answer}`).join('\n\n');
    const answer = await generateAnswer(question, context);
    res.json({ success: true, question, answer, contextFAQs });
  } catch (error) { next(error); }
};
