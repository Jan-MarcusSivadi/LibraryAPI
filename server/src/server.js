const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const port = process.env.PORT
const swaggerUI = require('swagger-ui-express')
const yamljs = require('yamljs')
const swaggerDocument = yamljs.load(__dirname + '/docs/swagger.yaml');

const express = require('express');
const app = express();

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/pub', express.static(path.join(__dirname, 'public')))
app.use(express.json());

require('../src/routes/userRoutes')(app)

require('../src/routes/bookRoutes')(app)
// app.use('/books', bookRoutes)

// GET http://localhost:5000/
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})


function getBaseurl(request) {
  return (request.connection && request.connection.encrypted ? "https" : "http") + "://" + request.headers.host
}

app.listen(port, () => {
  require("./db").sync()
    .then(console.log("Synchronized"))
    .catch((error) => console.log("Error:", error))
  console.log(`listening on port http://localhost:${port}`);
})
