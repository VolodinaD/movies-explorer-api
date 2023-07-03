const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = async (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  try {
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPass,
    });
    return res.status(200).send(user);
  } catch (err) {
    return next(err);
  }
};

module.exports.updateUserProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name, email: req.body.email,
  }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден.');
      }
      return res.send({ data: user });
    })
    .catch(next);
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
    res.status(200);
    return res.cookie('jwt', token, {
      maxAge: 3600000,
    }).send({ data: user });
  } catch (err) {
    return next(err);
  }
};

module.exports.exit = (req, res, next) => {
  try {
    return res.clearCookie('jwt').send({ message: 'Выход выполнен.' });
  } catch (err) {
    return next(err);
  }
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};
