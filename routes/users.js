const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateUserProfile, getCurrentUser, exit,
} = require('../controllers/users');

userRouter.get('/users/me', getCurrentUser);
userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUserProfile);
userRouter.post('/signout', exit);

module.exports = userRouter;
