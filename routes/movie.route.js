const express = require('express');
const movie = require('../models/movie');
const router = express.Router();
//get model from <model/>
const MovieModel = require('../models/movie');


//GET all moves
router.get('/', (req, res) => {
  //movie list or data come from  find method automaticly. it's up to me
  MovieModel.find()
    .then((movieList) => { res.json(movieList) })
    .catch((err) => { res.json(err) })
  // res.send('GET request to the Movie Page')
})

//POST
router.post('/', function (req, res) {
  const movie = new MovieModel(req.body);
  movie.save((err, data) => {
    if (err) { res.json(err) }
    res.json(data);
  });
  // movie.save().then(()=>{res.json(data)})
  // .catch(()=>{res.json(err)});
  // res.send('POST request to the Movie Page')
})
//GET a movie
router.get('/:movieId', (req, res, next) => {
  MovieModel.findById(req.params.movieId)
    .then((movieList) => {
      res.json(movieList);
    })
    .catch((errorMsg) => {
      next({ message: "The movie was not found.(CATCH)", code: 99 });
      res.json(errorMsg);
    });
})
//PUT update a movie
router.put('/:movieId', (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  const id = req.params.movieId;
  console.log(id);
  MovieModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Movie with id=${id}. Movie was not found!`
        });
      } else res.send({ message: " Movie was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Movie with id=" + id
      });
    });
});
//delete a movie
router.delete('/:movieId', (req, res) => {
  // var postId=req.params.movieId;
  console.log("=====>>>>>>" + req.params.movieId);
  MovieModel.findByIdAndRemove(postId, (err, post) => {
    if (err) { res.json(err) }
    res.json("Removed Post:" + post)
  })
})

//GET top 10 movies
router.get('/top10', (req, res) => {
  MovieModel.aggregate([

    {
      $sort: { imdb_score: -1 }
    },
    {
      $limit: 10
    },
    {
      $project: { title: true, imdb_score: 1, country: 1, category: 1 }
    },

  ], (err, result) => {
    if (err) res.json();
    res.json(result)
  });

})

//GET the specific years
router.get('/between/:start_year/:end_year', (req, res) => {
  console.log(req.params);
  MovieModel.find({
    year: {
      $gte: req.params.start_year,
      $lt: req.params.end_year,
    }
  }).then((movieList) => { res.json(movieList) })
    .catch((err) => { res.json(err + " Movie.For Entered Years") })
})





module.exports = router;

