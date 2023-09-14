const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.example') });
const port = process.env.PORT || 3000

const express = require('express');
const app = express();

app.use('/pub', express.static(path.join(__dirname, 'public')))
app.use(express.json());

// GET http://localhost:5000/
app.get('/', async (req, res) =>{
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.listen(port, () => console.log(`listening on port ${port}`));