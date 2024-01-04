const express = require('express');
const app = express();

const PORT = 3000;

app.use('/public', express.static('public'))

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/movies', (req, res) => {
    // res.send('Bientôt des films ici même');
    res.render('movies');
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