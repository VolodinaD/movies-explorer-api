const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const DeleteMovieError = require('../errors/DeleteMovieError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (movie === null) {
        throw new NotFoundError('Передан несуществующий id фильма.');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new DeleteMovieError('Нельзя удалить фильм другого пользователя.');
      }
      return movie.deleteOne();
    })
    .then((movie) => res.status(200).send({ data: movie }))
    .catch(next);
};
