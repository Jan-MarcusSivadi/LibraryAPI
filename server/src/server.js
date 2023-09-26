const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../../.env.example') });
const port = process.env.PORT || 3000
const swaggerUI = require('swagger-ui-express')
const yamljs = require('yamljs')
const swaggerDocument = yamljs.load(__dirname + '/docs/swagger.yaml')
const axios = require('axios');


const express = require('express');
const app = express();

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/pub', express.static(path.join(__dirname, 'public')))
app.use(express.json());

// GET http://localhost:5000/
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/books', async (req, res) => {
  // Optionally the request above could also be done as
  const data = await axios.get('http://gutendex.com/books')//'https://openlibrary.org/random')
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      // always executed
    });

  console.log(data)
  console.log(data.results.length)
    
  // const book = {
  //   key: data.key,
  //   title: data.title,
  //   full_title: data.full_title,
  //   subtitle: data.subtitle,
  //   description: data.description?.value,
  //   notes: data.notes,
  //   pages: data.number_of_pages,
  //   authors: data.authors,
  //   created: data.created
  // }
  // console.log('BOOK: ',book);

  const books = data.results.map(book => {
    return { id: book.id, name: book.title }
  })

  res.send(books)
})

app.listen(port, () => console.log(`listening on port ${port}`));