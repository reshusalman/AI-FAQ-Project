import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 500 },
    answer: { type: String, required: true, trim: true, maxlength: 5000 },
    category: { type: String, required: true, trim: true, maxlength: 100 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

faqSchema.index({ question: 'text', answer: 'text', category: 'text' });
faqSchema.index({ category: 1 });
faqSchema.index({ createdBy: 1 });

export default mongoose.model('FAQ', faqSchema);
