const allowedCors = [
  'https://volodina.movies.nomoreparties.sbs',
  'http://volodina.movies.nomoreparties.sbs',
  'https://volodina.movies.nomoreparties.sbs/users/me',
  'http://volodina.movies.nomoreparties.sbs/users/me',
  'https://localhost:3000',
  'http://localhost:3000',
  'https://localhost:3000/users/me',
  'http://localhost:3000/users/me',
];

const cors = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.end();
  }

  res.header('Access-Control-Expose-Headers', '*');

  return next();
};

module.exports = cors;
