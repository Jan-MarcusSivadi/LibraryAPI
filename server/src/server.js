const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../../.env.example') });
const port = process.env.PORT || 3000
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('./docs/swagger.json')


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
  res.send([
    {id:1,firstname:"Jeff",lastname:"Bezos",email:"jeffbezos@amazon.com",password:"markzuckerbergsux",username:"bigbezos420",phonenr:"+1 11748794 "},
    {id:2,firstname:"Mark",lastname:"Zuckerberg",email:"markzuckerberg@facebook.com",password:"jeffbezossux",username:"markzuckofficial",phonenr:"+1 82543794 "}])
})

app.listen(port, () => console.log(`listening on port http://localhost:${port}`));