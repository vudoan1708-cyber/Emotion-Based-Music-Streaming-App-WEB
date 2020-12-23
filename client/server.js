const express = require('express');

const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(__dirname, '/dist'));
app.use(express.json({ limit: '1mb' }));

// Single Page Application (SPA)
app.get(/.*/, (req, res) => {
  res.sendFile(__dirname, '/dist/index.html');
});
app.listen(port, () => { console.log('Server Started'); });
