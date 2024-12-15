const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const port = 3000;

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const filePath = `/uploads/${req.file.filename}`;
    res.send({ filePath });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

process.on('exit', () => {
    fs.rmSync(path.join(__dirname, 'uploads'), { recursive: true, force: true });
});


app.listen(port, () =>{
    console.log(`listening to the port at ${port}`);
});
