import mongoose from 'mongoose';

interface SharedNote extends Document {
  userId: mongoose.Types.ObjectId;
  noteId: mongoose.Types.ObjectId;
  sharedUserId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const sharedNoteSchema = new mongoose.Schema<SharedNote>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    sharedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const SharedNoteModel = mongoose.model<SharedNote>('SharedNote', sharedNoteSchema);
