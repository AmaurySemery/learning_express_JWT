const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const dotenv = require("dotenv");
var path = require('path');

const jsonwebtoken = require('jsonwebtoken');
var { expressjwt: jwt } = require("express-jwt");

dotenv.config();

const port = process.env.PORT;
let frenchMovies = [];

app.use('/public', express.static('public'));
// app.use(bodyParser.urlencoded({ extended: false }));

const secret = process.env.SECRET;



// cf documentation express-jwt
// Express jwt exige que tous les URL soient accessibles uniquement si un token est fournit par un client, sauf la page de login
// app.use(expressJwt({ secret: secret }).unless({ path: ['/login']}));
app.use(
    jwt({
      secret: secret,
      algorithms: ["HS256"],
    }).unless({ path: ["/", "/login", "/movie-search", "movies"] })
  );

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

// app.post('/movies', urlencodedParser, (req, res) => {
//     console.log('Le titre : ', req.body.movietitle);
//     console.log("L'année : ", req.body.movieyear);
//     const newMovie = { title: req.body.movietitle, year: req.body.movieyear };
//     frenchMovies = [...frenchMovies, newMovie];
//     console.log(frenchMovies);

//     res.sendStatus(201);
// });

app.post('/movies', upload.fields([]), (req, res) => {
    if(!req.body) {
        return res.sendStatus(500);
    } else {
        const formData = req.body;
        console.log('formData', formData);
        const newMovie = { title: req.body.movietitle, year: req.body.movieyear };
        frenchMovies = [...frenchMovies, newMovie];

        res.sendStatus(201);
    }
})

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

app.get('/movie-search', (req, res) => {
    const API = process.env.API_KEY;
    res.render('movie-search', { API });
});

app.get('/login', (req, res) => {
    res.render('login', {title: 'Espace membre'});
});

const fakeUser = { email: 'testuser@testmail.fr', password: 'qsd' };

app.post('/login', urlencodedParser, (req, res) => {
    console.log('login post', req.body);
    if(!req.body) {
        return res.sendStatus(500);
    } else {
        if(fakeUser.email === req.body.email && fakeUser.password === req.body.password) {
            const myToken = jsonwebtoken.sign({iss: 'http://expressmovies.fr', user: 'Amaury', role: 'moderator'}, secret);
            res.json(myToken);
            // res.json({
            //     email: 'testuser@testmail.fr',
            //     favoriteMovie: "Il était une fois dans l'Ouest",
            //     favoriteMovieTheater: "Ciné TNB, 1 rue Saint-Hélier, 35040 Rennes",
            //     lasLoginDate: new Date()
            // }); 
        } else {
            res.sendStatus(401);
        }
    }
});

app.get('/member-only', (req, res) => {
    console.log('req.user', req.user);
    res.send(req.user)
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});