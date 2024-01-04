import mongoose from 'mongoose';
import { NoteModel, SharedNoteModel } from '../model';

const createNote = async (title: string, content: string, userId: mongoose.Types.ObjectId) => {
  try {
    const newNote = new NoteModel({
      title,
      content,
      userId,
    });

    const savedNote = await newNote.save();

    return savedNote;
  } catch (error) {
    console.error('Error creating note in the service:', error);
    throw error;
  }
};

const getNotesByUserId = async (userId: mongoose.Types.ObjectId) => {
  try {
    const notes = await NoteModel.find({ userId });

    return notes;
  } catch (error) {
    console.error('Error getting notes by user ID in the service:', error);
    throw error;
  }
};

const getNoteByIdAndUserId = async (noteId: string, userId: mongoose.Types.ObjectId) => {
  try {
    const note = await NoteModel.findOne({ _id: noteId, userId });

    return note;
  } catch (error) {
    console.error('Error getting note by ID and user ID in the service:', error);
    throw error;
  }
};

const updateNoteByIdAndUserId = async (noteId: string, userId: mongoose.Types.ObjectId, updateData: { title?: string; content?: string }) => {
  try {
    const updatedNote = await NoteModel.findOneAndUpdate({ _id: noteId, userId }, { $set: updateData }, { new: true });

    return updatedNote;
  } catch (error) {
    console.error('Error updating note by ID and user ID in the service:', error);
    throw error;
  }
};

const deleteNoteByIdAndUserId = async (noteId: string, userId: mongoose.Types.ObjectId) => {
  try {
    const deletedNote = await NoteModel.findOneAndDelete({ _id: noteId, userId });

    return deletedNote;
  } catch (error) {
    console.error('Error deleting note by ID and user ID in the service:', error);
    throw error;
  }
};

const shareNoteByIdAndUserId = async (noteId: string, userId: mongoose.Types.ObjectId, sharedUserId: string) => {
  try {
    const isNoteAlreadyShared = await SharedNoteModel.exists({ noteId, userId: sharedUserId });

    if (isNoteAlreadyShared) {
      return null;
    }

    const note = await NoteModel.findOne({ _id: noteId, userId });

    if (!note) {
      return null;
    }

    const sharedNote = await SharedNoteModel.create({ userId: sharedUserId, noteId });

    return sharedNote;
  } catch (error) {
    console.error('Error sharing note by ID and user ID in the service:', error);
    throw error;
  }
};

const searchNotesByKeyword = async (userId: mongoose.Types.ObjectId, query: string) => {
  try {
    const searchResults = await NoteModel.find({
      userId,
      $text: { $search: query },
    });

    return searchResults;
  } catch (error) {
    console.error('Error searching notes by keyword in the service:', error);
    throw error;
  }
};

export {
  createNote,
  getNotesByUserId,
  getNoteByIdAndUserId,
  updateNoteByIdAndUserId,
  deleteNoteByIdAndUserId,
  shareNoteByIdAndUserId,
  searchNotesByKeyword,
};
