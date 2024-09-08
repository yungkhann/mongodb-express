import { body } from 'express-validator';

const registerValidation = [
  body('email', 'Not an email').isEmail(),
  body('password', 'Password should have minimum 5 characters').isLength({
    min: 5,
  }),
  body('fullName', 'Enter your name').isLength({ min: 5 }),
  body('avatarUrl', 'Wrong URL').optional().isURL(),
];

const loginValidation = [
  body('email', 'Not an email').isEmail(),
  body('password', 'Password should have minimum 5 characters').isLength({
    min: 5,
  }),
];

const postCreateValidation = [
  body('title', 'Enter the title of the post')
    .isLength({
      min: 5,
    })
    .isString(),
  body('body', 'Enter the body of the post')
    .isLength({
      min: 10,
    })
    .isString(),
  body('tags', 'Wrong format of the tags').optional().isString(),
  body('imageUrl', 'Wrong URL').optional().isString(),
];

export { registerValidation, loginValidation, postCreateValidation };
