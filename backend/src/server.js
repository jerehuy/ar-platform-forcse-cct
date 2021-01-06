const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const fileUpload = require('express-fileupload');

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Routers
const imagesRouter = require('./routes/images');
const coordinatesRouter = require('./routes/coordinates');
const pathRouter = require('./routes/path');
app.use('/images', imagesRouter);
app.use('/coordinates', coordinatesRouter);
app.use('/path', pathRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});