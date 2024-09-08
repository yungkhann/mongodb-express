import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import mongoose from 'mongoose';

import multer from 'multer';
import {
  loginValidation,
  postCreateValidation,
  registerValidation,
} from './validations.js';

import { PostController, UserController } from './controllers/index.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';
const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const PORT = process.env.PORT || 1017;

app.use(express.json());

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.use('/uploads', express.static('uploads'));

app.get('/users/:id', UserController.getOne);
app.get('/users', UserController.getAll);
app.get('/auth/me', checkAuth, UserController.getMe);
app.post(
  '/auth/login',
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  '/auth/register',
  registerValidation,
  handleValidationErrors,
  UserController.register
);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getPost);
app.post(
  '/posts',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.createPost
);
app.delete('/posts/:id', checkAuth, PostController.deletePost);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.updatePost
);

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

const uri = process.env.DATABASE_URL;

mongoose
  .connect(uri)
  .then(console.log('MongoDB is connected'))
  .catch(e => console.error('Error ocurred', e));
