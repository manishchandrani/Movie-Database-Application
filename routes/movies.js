var express = require('express');
var router = express.Router();
const movieRepo = require('../src/movierepo');
const { body, validationResult } = require('express-validator');

/* GET all movie listing */
router.get('/', async (req, res, next) => {
  const allMovieData = await movieRepo.findAll();
  res.render('movies',{ movies : allMovieData });
});

// Validation middleware
const validateMovie = [
  body('title').trim().notEmpty().withMessage('Title required').escape(),
  body('director').trim().notEmpty().withMessage('Director required').escape(),
  body('year').optional().trim().escape(),
  body('notes').optional().trim().escape(),
];

/* GET Create movie Page */
router.get('/new', (req, res, next) => {
  res.render('new',{title: 'Create a New Movie', buttonText: 'Create Movie', actionURL: 'new'});
});

/* POST movie Details from Create Movies Page */
router.post('/new', validateMovie, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('new', { title: 'Create a New Movie', buttonText: 'Create Movie', actionURL: 'new', errors: errors.array() });
    return;
  }

  const { title, director, year, notes } = req.body;
  const movie = { title: title, director: director, year: year, notes: notes};
  await movieRepo.createNewMovie(movie);
  res.redirect('/movies');
});

/* GET Single Movie View Page */
router.get('/:id', async (req, res, next) => {
  const singleMovieData = await movieRepo.findById(req.params.id);
  if(singleMovieData){
    res.render('show', { movie: singleMovieData });
  } else {
    res.redirect('/movies');
  }
});

/* GET Edit movie Page */
router.get('/:id/edit', async (req, res, next) => {
  const movieData = await movieRepo.findById(req.params.id);
  res.render('edit', { movie: movieData, title: 'Edit Movie', buttonText: 'Edit movie', actionURL: 'edit' });
});

/* POST Updated movie Details from Edit Movies Page */
router.post('/:id/edit', validateMovie, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('edit', { movie: req.body, title: 'Edit Movie', buttonText: 'Edit movie', actionURL: 'edit', errors: errors.array() });
    return;
  }

  const { title, director, year, notes } = req.body;
  const movieId = req.params.id;
  const updatedMovie = { title, director, year, notes };
  await movieRepo.updateMovie(movieId, updatedMovie);
  res.redirect('/movies/' + movieId);
});

/* GET Movie Confirm Delete Page */
router.get('/:id/delete', async (req, res, next) => {
  const data = await movieRepo.findById(req.params.id);
  res.render('delete', { movie: data });
});

/* POST Movie Delete */
router.post('/:id/delete', async (req, res, next) => {
  const movieId = req.params.id;
  const deletedCount = await movieRepo.deleteMovie(movieId);
  if (deletedCount > 0) {
    res.redirect('/movies');
  } else {
    res.status(404).send('Movie not found');
  }
});

module.exports = router;
