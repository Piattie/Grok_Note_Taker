const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET route for retrieving all notes
app.get('/api/notes', (req, res) => {
    fs.readFile('db/notes.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading notes');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// POST route for saving a new note
app.post('/api/notes', (req, res) => {
    const newNote = { id: uuidv4(), ...req.body };
    console.log(newNote);
    fs.readFile('db/notes.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading notes');
        } else {
            const notes = JSON.parse(data);
            notes.push(newNote);
            fs.writeFile('db/notes.json', JSON.stringify(notes), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error saving note');
                } else {
                    res.json(newNote);
                }
            });
        }
    });
});

// DELETE route for deleting a note
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile('db/notes.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading notes');
        } else {
            let notes = JSON.parse(data);
            notes = notes.filter(note => note.id !== noteId);
            fs.writeFile('db/notes.json', JSON.stringify(notes), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error deleting note');
                } else {
                    res.json({ id: noteId });
                }
            });
        }
    });
});

// Route for serving the notes HTML page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// Route for serving the index HTML page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
