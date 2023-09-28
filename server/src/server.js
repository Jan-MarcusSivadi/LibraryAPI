const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../../.env.example') });
const port = process.env.PORT || 3000
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('./docs/swagger.json')
const books = require('./books/data')

const express = require('express');
const app = express();

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/pub', express.static(path.join(__dirname, 'public')))
app.use(express.json());

// GET http://localhost:5000/
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

// GET books/:id
app.get('/books/:id', async (req, res) => {
  const { id } = req.params

  const book = books.getById(id)
  
  if (!book) {
    res.status(404).send({ error: "book not found." })
    return
  }

  res.send({
    "id": book.id,
    "name": book.name
  })
})

app.get('/books', async (req, res) => {
  res.send(books.getAll())
})

app.listen(port, () => console.log(`listening on port ${port}`));