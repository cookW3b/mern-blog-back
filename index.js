import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import { UserController, PostController } from './controllers/index.js'

import { registerValidation, loginValidaton, postCreateValidation } from './validations/validation.js';

import { checkAuth, handleValidationErrors } from './utils/index.js'

import cors from 'cors';
mongoose
	.connect('mongodb+srv://Admin:nord2022@cluster0.jpmmmie.mongodb.net/blog?retryWrites=true&w=majority')
	.then(() => console.log('DB ok'))
	.catch((err) => console.log('DB error', err))

const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	}
});

const upload = multer({ storage });

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

app.post('/auth/login', loginValidaton, handleValidationErrors, UserController.login);

app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
});

app.get('/new', PostController.getSortByDate);
app.get('/popular', PostController.getSortByViews);


app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation,handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.get('/tags', PostController.getLastTags);

app.listen(4444, (err) => {
	if(err){
		return console.log(err);
	}
	console.log('Server OK');
});

