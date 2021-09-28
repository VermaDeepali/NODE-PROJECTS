const Joi = require('joi'); //It returns class
const express = require('express'); //It returns object
const app = express();

app.use(express.json());

let books = [
    { id : 1, name: 'Angular'},
    { id : 2, name: 'Node'},
    { id : 3, name: 'Java'}
]

app.get('/', (req,res)=>{
    res.send("Hello Developers!!!");
})

//GET
app.get('/api/books', (req, res)=>{
    res.send(books)
})

//POST
app.post('/api/books', (req,res)=>{
    const { error } = validateBook(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    const book = {
        id : books.length + 1,
        name : req.body.name
    }
    books.push(book);
    res.send(book);
})

//PUT
app.put('/api/books/:id', (req, res)=>{
    let book = books.find(b => b.id === parseInt(req.params.id))
    if(!book) return res.status(404).send("The Book with the given ID was not found.")

    const { error } = validateBook(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    book.name = req.body.name;
    res.send(book);
})

//DELETE
app.delete('/api/books/:id', (req, res)=>{
    let book = books.find(b => b.id === parseInt(req.params.id))
    if(!book) return res.status(404).send("The Book with the given ID was not found.")

    const index = books.indexOf(book);
    books.splice(index, 1);

    res.send(book);
})


function validateBook(book){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(book, schema);
}


app.get('/api/books/:id', (req, res)=>{
    let book = books.find(b => b.id === parseInt(req.params.id))
    if(!book) return res.status(404).send("The Book with the given ID was not found.")
    res.send(book)
})


const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Listening on port ${port}...`);
})


// For Knowledge purpose
// Query String Parameters are used to provide additional data to our backends services(These are added in url after ? mmark)
// We use Route parameters for essential and required values and query string parameters for anything that is optional
//res.send(req.params)
//res.send(req.query)