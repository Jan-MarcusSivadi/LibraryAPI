const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../../.env.example') });
const port = process.env.PORT || 3000
const swaggerUI = require('swagger-ui-express')
const yamljs = require('yamljs')
const swaggerDocument = yamljs.load(__dirname + '/docs/swagger.yaml');
let users = require("./users/data")

const express = require('express');
const app = express();

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/pub', express.static(path.join(__dirname, 'public')))
app.use(express.json());

// GET http://localhost:5000/
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/users', (req, res) => {
  res.send(users.getAll())
  })

app.get('/users/:id', (req, res) => {
  const getUser = users.getById(req.params.id)
  if (getUser === undefined) return res.status(404).send({error: "Not found"})
  res.send(getUser)  
})

app.listen(port, () => console.log(`listening on port http://localhost:${port}`));