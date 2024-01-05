const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = 3000;
let frenchMovies = [];

app.use('/public', express.static('public'));
// app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/movies', (req, res) => {
    // res.send('Bientôt des films ici même');
    const title = "Films français des trente dernières années";
    
    const frenchMovies = [
        { title: "Le fabuleux destin d'Amélie Poulain", year: 2001 },
        { title: "Buffet froid", year: 1979 },
        { title: "Le diner de cons", year: 1998 },
        { title: "De rouille et d'os", year: 2012 }
    ];
    res.render('movies', { movies: frenchMovies, title: title });
});

var urlencodedParser = bodyParser.urlencoded({extended: false})

app.post('/movies', urlencodedParser, (req, res) => {
    console.log('Le titre : ', req.body.movietitle);
    console.log("L'année : ", req.body.movieyear);
    const newMovie = { title: req.body.movietitle, year: req.body.movieyear };
    frenchMovies = [...frenchMovies, newMovie];
    console.log(frenchMovies);

    res.sendStatus(201);
});

// app.get('/movie-details', (req, res) => {
//     res.render('movie-details');
// });

app.get('/movies/add', (req, res) => {
    res.send("Prochainement, un formulaire d'ajout ici");
});

app.get('/movies/:id/:title', (req, res) => {
    const id = req.params.id;
    const title = req.params.title;
    // res.send(`Film numéro ${id}`);
    res.render('movie-details', { movieid: id, movietitle: title });
});

app.get('/', (req, res) => {
    // res.send('Hello World !');
    res.render('index');
});

app.listen(3000, (req, res) => {
    console.log(`listening on port ${PORT}`);
});