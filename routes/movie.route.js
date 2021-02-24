const express=require('express');
const movie = require('../models/movie');
const router=express.Router();
//get model from <model/>
const MovieModel=require('../models/movie');


//GET all moves
router.get('/', (req, res) => {
  //movie list or data come from  find method automaticly. it's up to me
  MovieModel.find()
                .then((movieList)=>{res.json(movieList)})
                .catch((err)=>{res.json(err)})
  // res.send('GET request to the Movie Page')
})



//POST
router.post('/', function (req, res) {
  const movie=new MovieModel(req.body);
  movie.save((err,data)=>{
    if(err){res.json(err)}
    res.json(data);
  });
  // movie.save().then(()=>{res.json(data)})
  // .catch(()=>{res.json(err)});


  // res.send('POST request to the Movie Page')
})



//GET top 10 moves
router.get('/top10', (req, res) => {
  MovieModel.aggregate([
    
    {
      $sort: {imdb_score:-1}
    },
    {
      $limit:10
    },
    {
      $project: {title:true,imdb_score:1,country:1,category:1 }
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
}).then((movieList)=>{res.json(movieList)})
.catch((err)=>{res.json(err)})
})


//GET a movie
router.get('/:movieId', (req, res,next) => {
  MovieModel.findById(req.params.movieId)
                  .then((movieList)=>{          
                      res.json(movieList);})
                  .catch((errorMsg)=>{
                      next({message:"The movie was not found.(CATCH)",code:99});
                      res.json(errorMsg);});
})
//PUT a movie

router.put('/:movieId',(req,res)=>{
 
  console.log("=====>>>>>>Movie Id to Update: "+req.params.movieId);

  MovieModel.findOneAndUpdate(req.params.movieId,(err,data)=>{
    console.log(data);
    const movie=new MovieModel(req.body);
    movie.save((err,data)=>{
      if(err){res.json(err)}
     return res.json(data);
    });
})
})

//delete a movie
router.delete('/:movieId',(req,res)=>{
  // var postId=req.params.movieId;
  console.log("=====>>>>>>"+req.params.movieId);
  MovieModel.findByIdAndRemove(postId,(err,post)=>{
    if (err) {res.json(err)}
    res.json("Removed Post:"+post)
  })
})
module.exports=router;