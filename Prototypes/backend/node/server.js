require('dotenv').config();

const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser')
const fallback = require('express-history-api-fallback');

const compression = require('compression');

// components
const callbackRouter = require('./routes/callback');
const loginRouter = require('./routes/login');
// const refreshRouter = require('./routes/refresh');

const root = path.join(__dirname, '../dist');
const port = process.env.PORT || 5000;

const app = express();

// cookie parser for authenticating correct redirecting
app.use(cookieParser());
app.use(compression());

// routes
loginRouter(app);
callbackRouter(app);
// refreshRouter(app);

// check if the app is running in production
if (process.env.NODE_ENV === 'production') {

  // use the static files
  app.use(express.static(root));

// otherwise
} else {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  })
}

// fallback
app.use(fallback('index.html', { root }));

// listening to any dynamic port number
app.listen(port, () => console.log('Listening on port ' + port));
