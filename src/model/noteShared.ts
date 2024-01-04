import mongoose from 'mongoose';

interface SharedNote extends Document {
  userId: string;
  noteId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const sharedNoteSchema = new mongoose.Schema<SharedNote>(
  {
    userId: {
      type: String,
      required: true,
    },
    noteId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const SharedNoteModel = mongoose.model<SharedNote>('SharedNote', sharedNoteSchema);
