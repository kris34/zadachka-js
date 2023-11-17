const express = require('express');
const { initMongo } = require('./config/mongo');
const app = express();
const port = 3000;
const parse = require('./public/javascript/parser');
const { useMulter } = require('./multer');
const Channel = require('./models/channelModel');

app.post('/upload', useMulter().single('m3uFile'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const parsed = await parse(filePath);
    res.status(200).redirect('/');
  } catch (err) {
    res.status(400).redirect('/');
  }
});

app.get('/search', async (req, res) => {
  const searchTerm = req.query.q;

  const results = await Channel.find({
    $or: [
      { name: new RegExp(searchTerm, 'i') },
      { duration: new RegExp(searchTerm, 'i') },
      { URL: new RegExp(searchTerm, 'i') },
      { groupTitle: new RegExp(searchTerm, 'i') },
      { tvgId: new RegExp(searchTerm, 'i') },
    ],
    /* name: new RegExp(searchTerm, 'i'), */
  }).exec();

  res.status(200).send(results);
});

app.get('/items', async (req, res) => {
  try {
    const items = await Channel.find({});

    res.status(200).send(items);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

start();
async function start() {
  app.use(express.static('public'));
  await initMongo();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
