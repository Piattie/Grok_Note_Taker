const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbFilePath = path.join(__dirname, '../db/db.json');

module.exports = (app) => {
  app.get('/api/notes', (req, res) => {
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
      if (err) throw err;
      res.json(JSON.parse(data));
    });
  });

  app.post('/api/notes', (req, res) => {
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
      if (err) throw err;
      const notes = JSON.parse(data);
      const newNote = { id: uuidv4(), ...req.body };
      notes.push(newNote);

      fs.writeFile(dbFilePath, JSON.stringify(notes, null, 2), (err) => {
        if (err) throw err;
        res.json(newNote);
      });
    });
  });

  app.delete('/api/notes/:id', (req, res) => {
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
      if (err) throw err;
      let notes = JSON.parse(data);
      notes = notes.filter(note => note.id !== req.params.id);

      fs.writeFile(dbFilePath, JSON.stringify(notes, null, 2), (err) => {
        if (err) throw err;
        res.json({ success: true });
      });
    });
  });
};
