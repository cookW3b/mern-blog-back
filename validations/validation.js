import { body } from 'express-validator';

export const loginValidaton = [
	body('email', 'Неверный формат почты').isEmail(),
	body('password', 'Пароль должен содержать минимум 8 символов').isLength({min: 8}),
];

export const registerValidation = [
	body('email', 'Неверный формат почты').isEmail(),
	body('password', 'Пароль должен содержать минимум 8 символов').isLength({min: 8}),
	body('fullName', 'Укажите настоящее имя').isLength({min:3}),
	body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL()
];


export const postCreateValidation = [
	body('title', 'Введите заголовок статьи').isLength({min: 3}),
	body('text', 'Введите текст статьи').isLength({min: 10}),
	body('tags', 'Неверный формат тэгов (укажите массив)').optional().isArray(),
	body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
	body('comments', 'Неверный формат комментария').optional(),
];