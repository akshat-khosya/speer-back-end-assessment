import express from 'express';

import { validate } from '../middlewares';
import { createNoteSchema, deleteNoteSchema, getNoteByIdSchema, patchNoteSchema, shareNoteSchema } from '../schema';
import {
  createNoteHandler,
  deleteNoteByIdHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  shareNoteByIdHandler,
  updateNoteByIdHandler,
} from '../controllers';

const noteRouter = express.Router();

noteRouter.post('/', validate(createNoteSchema), createNoteHandler);

noteRouter.get('/', getAllNotesHandler);

noteRouter.get('/:id', validate(getNoteByIdSchema), getNoteByIdHandler);

noteRouter.put('/:id', validate(patchNoteSchema), updateNoteByIdHandler);

noteRouter.delete('/:id', validate(deleteNoteSchema), deleteNoteByIdHandler);

noteRouter.post('/:id/share', validate(shareNoteSchema), shareNoteByIdHandler);

export default noteRouter;
