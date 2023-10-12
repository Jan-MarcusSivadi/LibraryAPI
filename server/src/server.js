const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const port = process.env.PORT
const swaggerUI = require('swagger-ui-express')
const yamljs = require('yamljs')
const swaggerDocument = yamljs.load(__dirname + '/docs/swagger.yaml');
const users = require('./users/data')

const express = require('express');
const app = express();

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/pub', express.static(path.join(__dirname, 'public')))
app.use(express.json());

require('../src/routes/bookRoutes')(app)
// app.use('/books', bookRoutes)

// GET http://localhost:5000/
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

// READ
app.get('/users', (req, res) => {
  res.send(users.getAll())
})

// READ
app.get('/users/:id', (req, res) => {
  const getUser = users.getById(req.params.id)
  if (getUser === undefined) return res.status(404).send({ error: "Not found" })
  res.send(getUser)
})

// CREATE
app.post('/users', (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password || !req.body.username || !req.body.phonenr)
  {
    return res.status(400).send({error: "One or all required parameters are missing"})
  }
  const createdUser = users.create({
    firstname:req.body.firstname,
    lastname:req.body.lastname,
    email:req.body.email,
    password:req.body.password,
    username:req.body.username,
    phonenr:req.body.phonenr
  })
  res.status(201)
    .location(`${getBaseurl(req)}/users/${createdUser.id}`)
    .send(createdUser)
})

// DELETE

app.delete('/users/:id', (req, res) => {
  if(users.delete(req.params.id) === undefined) {
    return res.status(404).send({error: "User not found"})
  }
  res.status(204).send()
})

function getBaseurl(request) {
  return (request.connection && request.connection.encrypted ? "https" : "http") + "://" + request.headers.host
}

app.listen(port, () => {
  require("./db").sync()
    .then(console.log("Synchronized"))
    .catch((error) => console.log("Error:", error))
  console.log(`listening on port http://localhost:${port}`)
});