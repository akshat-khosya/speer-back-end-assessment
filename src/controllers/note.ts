import { Request, Response } from 'express';
import {
  createNote,
  getNotesByUserId,
  getNoteByIdAndUserId,
  updateNoteByIdAndUserId,
  deleteNoteByIdAndUserId,
  shareNoteByIdAndUserId,
  searchNotesByKeyword,
} from '../services';

const createNoteHandler = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    // create note
    const newNote = await createNote(title, content, userId);

    return res.status(201).json({ message: 'Note created successfully', note: newNote });
  } catch (error) {
    console.error('Error creating note:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllNotesHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const notes = await getNotesByUserId(userId);

    return res.status(200).json({ notes });
  } catch (error) {
    console.error('Error getting all notes:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getNoteByIdHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const noteId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const note = await getNoteByIdAndUserId(noteId, userId);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    return res.status(200).json({ note });
  } catch (error) {
    console.error('Error getting note by ID:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateNoteByIdHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const noteId = req.params.id;
    const { title, content } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const updatedNote = await updateNoteByIdAndUserId(noteId, userId, { title, content });

    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    return res.status(200).json({ message: 'Note updated successfully', note: updatedNote });
  } catch (error) {
    console.error('Error updating note by ID:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteNoteByIdHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const noteId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const deletedNote = await deleteNoteByIdAndUserId(noteId, userId);

    if (!deletedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    return res.status(200).json({ message: 'Note deleted successfully', note: deletedNote });
  } catch (error) {
    console.error('Error deleting note by ID:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const shareNoteByIdHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const noteId = req.params.id;
    const { sharedUserId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    if (userId === sharedUserId) {
      return res.status(400).json({ error: 'Cannot share a note with yourself' });
    }
    const sharedNote = await shareNoteByIdAndUserId(noteId, userId, sharedUserId);

    if (!sharedNote) {
      return res.status(404).json({ error: 'Note not found or already shared' });
    }

    return res.status(200).json({ message: 'Note shared successfully', sharedNote });
  } catch (error) {
    console.error('Error sharing note by ID:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const searchNotesHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const query = req.query.q as string;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const searchResults = await searchNotesByKeyword(userId, query);

    return res.status(200).json({ message: 'Search successful', results: searchResults });
  } catch (error) {
    console.error('Error searching notes by keyword:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  createNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  updateNoteByIdHandler,
  deleteNoteByIdHandler,
  shareNoteByIdHandler,
  searchNotesHandler,
};
