import FAQ from '../models/FAQ.js';

export const createFAQ = async (req, res, next) => {
  try {
    const { question, answer, category, published } = req.body;
    const faq = await FAQ.create({ question, answer, category, published, createdBy: req.user._id });
    res.status(201).json({ success: true, faq });
  } catch (error) { next(error); }
};

export const getFAQs = async (req, res, next) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { published: true };
    if (req.query.category) filter.category = req.query.category;
    const faqs = await FAQ.find(filter).populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: faqs.length, faqs });
  } catch (error) { next(error); }
};

export const getFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id).populate('createdBy', 'name email');
    if (!faq || (!faq.published && req.user?.role !== 'admin')) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, faq });
  } catch (error) { next(error); }
};

export const updateFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    if (req.user.role !== 'admin' && faq.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'You can update only your own FAQ' });
    const allowed = ['question', 'answer', 'category', 'published'];
    allowed.forEach((key) => { if (req.body[key] !== undefined) faq[key] = req.body[key]; });
    await faq.save();
    res.json({ success: true, faq });
  } catch (error) { next(error); }
};

export const deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    if (req.user.role !== 'admin' && faq.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'You can delete only your own FAQ' });
    await faq.deleteOne();
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (error) { next(error); }
};

export const searchFAQs = async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) return res.status(400).json({ success: false, message: 'Search query q is required' });
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const faqs = await FAQ.find({ published: true, $or: [{ question: regex }, { answer: regex }, { category: regex }] })
      .populate('createdBy', 'name').sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, query: q, count: faqs.length, faqs });
  } catch (error) { next(error); }
};
