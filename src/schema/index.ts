import { createUserSchema, loginUserSchema } from './auth';
import { createNoteSchema, getNoteByIdSchema, patchNoteSchema, deleteNoteSchema, shareNoteSchema, searchNoteSchema } from './notes';

export {
  createUserSchema,
  loginUserSchema,
  createNoteSchema,
  getNoteByIdSchema,
  patchNoteSchema,
  deleteNoteSchema,
  shareNoteSchema,
  searchNoteSchema,
};
