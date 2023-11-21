const path = require('path')
const cors = require('cors')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const port = process.env.PORT || 3000
const swaggerUI = require('swagger-ui-express')
const yamljs = require('yamljs')
const swaggerDocument = yamljs.load(__dirname + '/docs/swagger.yaml');

const express = require('express');
const app = express();

app.use("/client", express.static(path.join(__dirname, '../../front/src')))
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/pub', express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(express.json());


require('../src/routes/userRoutes')(app)
require('../src/routes/bookRoutes')(app)
require("../src/routes/orderRoutes")(app)
// app.use('/books', bookRoutes)

// GET http://localhost:3000/
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.listen(port, () => {
  require("./db").sync()
    .then(console.log("Synchronized"))
    .catch((error) => console.log("Error:", error))
  console.log(`listening on port http://localhost:${port}`);
})
