const express = require('express');

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
//get the movies with diretors
router.get('/listWithDirector', (req, res) => {
  MovieModel.aggregate(
      [
          {
              $lookup:
                      {
                          from:'directors',
                          localField:'director_id',
                          foreignField:'_id',
                          as:'director'
                      }
          }
      ]
  )
                  .then((movieList)=>{res.json(movieList);})
                  .catch((errorMsg)=>{res.json(errorMsg);});
})
//POST
router.post('/', function (req, res) {
  const movie = new MovieModel(req.body);
  movie.save((err, data) => {
    if (err) { res.json(err) }
    res.json(data);
  });
  // movie.save().then(()=>{res.json(data)})
  // .catch(()=>{res.json(err)});s
  // res.send('POST request to the Movie Page')
})


//GET top 10 movies encoded by me
// router.get('/top10', (req, res) => {
//   MovieModel.aggregate([

//     {
//       $sort: { imdb_score: -1 }
//     },
//     {
//       $limit: 10
//     },
//     {
//       $project: { title: true, imdb_score: 1, country: 1, category: 1 }
//     },

//   ], (err, result) => {
//     if (err) res.json();
//     res.json(result)
//   });

// })
//GET ALL MOVIES : .../api/movies/top10 encoden by teacher
router.get('/top10', (req, res) => {
  MovieModel.find().limit(10).sort({imdb_score:-1})
                  .then((movieList)=>{res.json(movieList);})
                  .catch((errorMsg)=>{res.json(errorMsg);});
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
//PUT update a movie,encoded by me
// router.put('/:movieId', (req, res) => {
//   if (!req.body) {
//     return res.status(400).send({
//       message: "Data to update can not be empty!"
//     });
//   }
//   const id = req.params.movieId;
//   console.log(id);
//   MovieModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
//     .then(data => {
//       if (!data) {
//         res.status(404).send({
//           message: `Cannot update Movie with id=${id}. Movie was not found!`
//         });
//       } else res.send({ message: " Movie was updated successfully." });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error updating Movie with id=" + id
//       });
//     });
// });


//PUT update a movie,encoded by teacher
//localhost:3000/api/movies/:movieId
//XXXXXX.findByIdAndUpdate("_id",req.body).YYYYYYYYYYY

/*Eğer ki şarta uyan tüm verilerde update işlemini uygulamak istiyorsanız sorguya “multi : true” değerini aşağıdaki gibi belirtmeniz gerekmektedir.
Upsert Anahtar Kelimesi
Yapacağımız güncelleme işlemlerinde eğer ki şarta uygun veri varsa ilgili işlemi icra edebiliriz. Ya yoksa! ve böyle bir durumda olmayan veriyi kaydetmek istiyorsak! Evet… Bu işlemi kontrollerle sağlayabiliriz lakin Upsert keywordü tam da bu ihtiyaca istinaden üretilmiş bir işlevselliğe sahiptir.
*/
router.put('/:movieId',(req,res,next)=>{
  MovieModel.findByIdAndUpdate(req.params.movieId,req.body,{new:true})
                  .then((data)=>{res.json(data)})
                  .catch((err)=>{
                      next({message:'The movie was not found.',code:99})
                      res.json(err)
                  })
})
//delete a movie encoded by teacher
//localhost:3000/api/movies/:movieId
router.delete('/:movieId',(req,res,next)=>{
  MovieModel.findByIdAndRemove(req.params.movieId)
              .then((data)=>{res.json(data)})
              .catch((err)=>{
                  next({message:'The movie was not found.',code:99})
                  res.json(err)
              })
})

//delete a movie encoded by me
// router.delete('/:movieId', (req, res,next) => {
//   // var postId=req.params.movieId;
//   console.log("=====>>>>>>" + req.params.movieId);
//   MovieModel.findByIdAndRemove(req.params.movieId, (err, movie) => {
//     if (err) { res.json(movie) }
//     res.json("Removed Post:" + post)
//   })
// })



//GET the specific years
// router.get('/between/:start_year/:end_year', (req, res) => {
//   console.log(req.params);
//   MovieModel.find({
//     year: {
//       $gte: req.params.start_year,
//      $lt: req.params.end_year,
//     }
//   }).then((movieList) => { res.json(movieList) })
//     .catch((err) => { res.json(err + " Movie.For Entered Years") })
// })
//GET  the specific years encoded by teacher
router.get('/between/:startYear/:endYear', (req, res) => {
  const {startYear,endYear} = req.params;
  //greater than or equal --- less than or equal 
  MovieModel.find({year:{"$gte":parseInt(startYear),"$lte":parseInt(endYear)}})
                  .then((movieList)=>{res.json(movieList);})
                  .catch((errorMsg)=>{res.json(errorMsg);});
})

/*
modelName.functionName(Filter,propObjs)[.SKIP-LIMIT-SORT]
            .then((resultObj)=>{res.json(resultObj)})
            .catch((resultError)=>{res.json(resultError)})
*/


module.exports = router;

