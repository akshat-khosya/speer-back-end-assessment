import { object, string } from 'yup';

const createNoteSchema = object({
  body: object({
    title: string().required('Title is Required'),
    content: string().required('Content is Required'),
  }),
  headers: object({
    'content-type': string().required('Content Type is Required').equals(['application/json'], 'Content Type must be application/json'),
  }),
});

const getNoteByIdSchema = object({
  params: object({
    id: string()
      .required('Note ID is required')
      .matches(/^[a-f\d]{24}$/i, 'Invalid MongoDB ObjectId'),
  }),
});

const patchNoteSchema = object({
  params: object({
    id: string()
      .required('Note ID is required')
      .matches(/^[a-f\d]{24}$/i, 'Invalid MongoDB ObjectId'),
  }),
  body: object({
    title: string(),
    content: string(),
  }),
  headers: object({
    'content-type': string().required('Content Type is Required').equals(['application/json'], 'Content Type must be application/json'),
  }),
});

const deleteNoteSchema = object({
  params: object({
    id: string()
      .required('Note ID is required')
      .matches(/^[a-f\d]{24}$/i, 'Invalid MongoDB ObjectId'),
  }),
});

const shareNoteSchema = object({
  params: object({
    id: string()
      .required('Note ID is required')
      .matches(/^[a-f\d]{24}$/i, 'Invalid MongoDB ObjectId'),
  }),
  body: object({
    sharedUserId: string()
      .required('User ID is required')
      .matches(/^[a-f\d]{24}$/i, 'Invalid MongoDB ObjectId'),
  }),
  headers: object({
    'content-type': string().required('Content Type is Required').equals(['application/json'], 'Content Type must be application/json'),
  }),
});

const searchNoteSchema = object({
  q: string().required('Search query is required'),
});

export { createNoteSchema, getNoteByIdSchema, patchNoteSchema, deleteNoteSchema, shareNoteSchema, searchNoteSchema };
