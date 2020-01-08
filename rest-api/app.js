const express = require('express');

const feedRoutes = require('./routes/feed');

app.use('/feed', feedRoutes);

const app = express();

app.listen(8080);
