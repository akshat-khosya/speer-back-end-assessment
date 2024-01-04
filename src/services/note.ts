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

    const sharedNote = await SharedNoteModel.create({ userId: userId, sharedUserId: sharedUserId, noteId });

    return sharedNote;
  } catch (error) {
    console.error('Error sharing note by ID and user ID in the service:', error);
    throw error;
  }
};

const searchNotesByKeyword = async (userId: mongoose.Types.ObjectId, query: string) => {
  try {
    const regexQuery = new RegExp(query, 'i');

    const personalNotes = await NoteModel.find({
      $and: [
        { userId },
        {
          $or: [{ title: { $regex: regexQuery } }, { content: { $regex: regexQuery } }],
        },
      ],
    });

    const sharedNotes = await SharedNoteModel.aggregate([
      {
        $match: { sharedUserId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: 'notes',
          localField: 'noteId',
          foreignField: '_id',
          as: 'sharedNoteDetails',
        },
      },
      {
        $unwind: '$sharedNoteDetails',
      },
      {
        $match: {
          $or: [{ 'sharedNoteDetails.title': { $regex: regexQuery } }, { 'sharedNoteDetails.content': { $regex: regexQuery } }],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'sharedByUser',
        },
      },
      {
        $unwind: {
          path: '$sharedByUser',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          noteId: '$sharedNoteDetails._id',
          title: '$sharedNoteDetails.title',
          content: '$sharedNoteDetails.content',
          sharedByUser: {
            name: '$sharedByUser.name',
            email: '$sharedByUser.email',
          },
        },
      },
    ]);

    return { personal: personalNotes, shared: sharedNotes };
  } catch (error) {
    console.error('Error searching notes by keyword:', error);
    throw error;
  }
};

const getSharedNotesWithUserDetails = async (userId: mongoose.Types.ObjectId) => {
  try {
    console.log(userId);
    const sharedNotesWithDetails = await SharedNoteModel.aggregate([
      {
        $match: { sharedUserId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'sharedByUser',
        },
      },
      {
        $unwind: '$sharedByUser',
      },
      {
        $lookup: {
          from: 'notes',
          localField: 'noteId',
          foreignField: '_id',
          as: 'sharedNoteDetails',
        },
      },
      {
        $unwind: '$sharedNoteDetails',
      },
      {
        $project: {
          noteId: '$noteId',
          sharedByUser: {
            name: '$sharedByUser.name',
            email: '$sharedByUser.email',
          },
          sharedNoteDetails: {
            title: '$sharedNoteDetails.title',
            content: '$sharedNoteDetails.content',
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return sharedNotesWithDetails;
  } catch (error) {
    console.error('Error fetching shared notes with user details:', error);
    throw error;
  }
};

const getSharedNoteByIdAndUserId = async (noteId: string, userId: mongoose.Types.ObjectId) => {
  try {
    const sharedNote = await SharedNoteModel.aggregate([
      {
        $match: { noteId: new mongoose.Types.ObjectId(noteId), sharedUserId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: 'notes',
          localField: 'noteId',
          foreignField: '_id',
          as: 'noteDetails',
        },
      },
      {
        $unwind: '$noteDetails',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'sharedByUser',
        },
      },
      {
        $unwind: '$sharedByUser',
      },
      {
        $project: {
          _id: 1,
          noteId: 1,
          type: 'private',
          createdAt: 1,
          updatedAt: 1,
          noteDetails: {
            title: '$noteDetails.title',
            content: '$noteDetails.content',
          },
          sharedByUser: {
            name: '$sharedByUser.name',
            email: '$sharedByUser.email',
          },
        },
      },
    ]);

    return sharedNote[0];
  } catch (error) {
    console.error('Error getting shared note by ID and user ID:', error);
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
  getSharedNotesWithUserDetails,
  getSharedNoteByIdAndUserId,
};
