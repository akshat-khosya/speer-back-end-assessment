import { User } from '../../src/model';
import { app } from '../testSetup';

const request = require('supertest');

describe('Note API', () => {
  let userToken: string;

  beforeAll(async () => {
    const userForAuth = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testPassword',
    };
    await request(app).post('/api/auth/create').send(userForAuth).set('Content-Type', 'application/json');

    const loginCredentials = {
      email: 'testuser@example.com',
      password: 'testPassword',
    };
    const loginRes = await request(app).post('/api/auth/login').send(loginCredentials).set('Content-Type', 'application/json');
    userToken = loginRes.body.accessToken;
  }, 10000);

  describe('Create Note', () => {
    it('should create a new note', async () => {
      const noteData = {
        title: 'Test Note',
        content: 'This is a test note.',
      };

      const res = await request(app)
        .post('/api/note')
        .send(noteData)
        .set('Authorization', `Bearer ${userToken}`)
        .set('Content-Type', 'application/json');

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'Note created successfully');
      expect(res.body).toHaveProperty('note');
      expect(res.body.note.title).toEqual('Test Note');
    }, 10000);

    it('title not found', async () => {
      const noteData = {
        content: 'This is a test note.',
      };

      const res = await request(app)
        .post('/api/note')
        .send(noteData)
        .set('Authorization', `Bearer ${userToken}`)
        .set('Content-Type', 'application/json');

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ message: 'Title is Required' });
    }, 10000);

    it('content not found', async () => {
      const noteData = {
        title: 'Test Note',
      };

      const res = await request(app)
        .post('/api/note')
        .send(noteData)
        .set('Authorization', `Bearer ${userToken}`)
        .set('Content-Type', 'application/json');

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ message: 'Content is Required' });
    }, 10000);
  });

  let createdNoteId: string;
  beforeAll(async () => {
    const noteData = {
      title: 'Test Note',
      content: 'This is Test Note',
    };
    const createNoteRes = await request(app)
      .post('/api/note')
      .send(noteData)
      .set('Authorization', `Bearer ${userToken}`)
      .set('Content-Type', 'application/json');

    createdNoteId = createNoteRes.body.note._id;
  });

  describe('Get all notes', () => {
    it('should get all notes for the authenticated user', async () => {
      const res = await request(app).get('/api/note').set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('notes');
      expect(res.body.notes).toHaveProperty('personal');
      expect(res.body.notes).toHaveProperty('shared');
    });
  });

  describe('Get Note by Id', () => {
    it('get note by id for authenticated user', async () => {
      const res = await request(app).get(`/api/note/${createdNoteId}`).set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('note');
      expect(res.body.note).toHaveProperty('noteDetails');
      expect(res.body.note).toHaveProperty('type');
    });

    it('Note id is not valid', async () => {
      const res = await request(app).get(`/api/note/sampleId`).set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ message: 'Invalid MongoDB ObjectId' });
    });

    it('Note id is not found', async () => {
      const res = await request(app).get(`/api/note/659706c43a935e83ed9f9854`).set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: 'Note not found' });
    });
  });

  describe('Update Note', () => {
    const updateData = {
      title: 'Updated Test Note',
      content: 'This is the updated test note.',
    };
    it('should update a personal note by ID', async () => {
      const res = await request(app)
        .put(`/api/note/${createdNoteId}`)
        .send(updateData)
        .set('Authorization', `Bearer ${userToken}`)
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Note updated successfully');
      expect(res.body).toHaveProperty('note');
      expect(res.body.note.title).toEqual('Updated Test Note');
    });

    it('Note id is not valid', async () => {
      const res = await request(app)
        .put(`/api/note/sampleId`)
        .send(updateData)
        .set('Authorization', `Bearer ${userToken}`)
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ message: 'Invalid MongoDB ObjectId' });
    });

    it('Note id is not found', async () => {
      const res = await request(app)
        .get(`/api/note/659706c43a935e83ed9f9854`)
        .send(updateData)
        .set('Authorization', `Bearer ${userToken}`)
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: 'Note not found' });
    });
  });

    
  afterAll(async () => {
    await User.deleteOne({ email: 'testuser@example.com' });
  });
});

// it('should share a note with another user', async () => {
//   const shareData = {
//     sharedUserId: '659706c43a935e83ed9f9854',
//   };

//   const res = await request(app)
//     .post(`/api/${createdNoteId}/share`)
//     .send(shareData)
//     .set('Authorization', `Bearer ${userToken}`)
//     .set('Content-Type', 'application/json');

//   expect(res.statusCode).toEqual(200);
//   expect(res.body).toHaveProperty('message', 'Note shared successfully');
//   expect(res.body).toHaveProperty('sharedNote');
// });

// it('should update a personal note by ID', async () => {
//   const updateData = {
//     title: 'Updated Test Note',
//     content: 'This is the updated test note.',
//   };

//   const res = await request(app)
//     .put(`/api/notes/${createdNoteId}`)
//     .send(updateData)
//     .set('Authorization', `Bearer ${userToken}`)
//     .set('Content-Type', 'application/json');

//   expect(res.statusCode).toEqual(200);
//   expect(res.body).toHaveProperty('message', 'Note updated successfully');
//   expect(res.body).toHaveProperty('note');
//   expect(res.body.note.title).toEqual('Updated Test Note');
// });

// it('should search notes by keyword successfully', async () => {
//   const searchQuery = 'Test';

//   const res = await request(app)
//     .get(`/api/notes/search?q=${searchQuery}`)
//     .set('Authorization', `Bearer ${userToken}`)
//     .set('Content-Type', 'application/json');

//   expect(res.statusCode).toEqual(200);
//   expect(res.body).toHaveProperty('message', 'Search successful');
//   expect(res.body).toHaveProperty('results');
//   const searchResults = res.body.results;
//   expect(searchResults).toHaveLength(1);
//   expect(searchResults[0]).toHaveProperty('title', 'Test Note');
// });

// it('should delete a personal note by ID', async () => {
//   const res = await request(app).delete(`/api/notes/${createdNoteId}`).set('Authorization', `Bearer ${userToken}`);

//   expect(res.statusCode).toEqual(200);
//   expect(res.body).toHaveProperty('message', 'Note deleted successfully');
//   expect(res.body).toHaveProperty('note');
//   expect(res.body.note._id).toEqual(createdNoteId);
// });
