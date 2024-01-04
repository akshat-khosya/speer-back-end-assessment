import mongoose from 'mongoose';

interface INote extends Document {
  title: string;
  content: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const noteSchema = new mongoose.Schema<INote>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const NoteModel = mongoose.model<INote>('Note', noteSchema);
