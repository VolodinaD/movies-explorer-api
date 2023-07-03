class DeleteMovieError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DeleteMovieError';
    this.statusCode = 403;
  }
}

module.exports = DeleteMovieError;
