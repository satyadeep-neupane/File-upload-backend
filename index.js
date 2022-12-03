const express = require('express');
const app = express();
const port = 5000;

const uploader = require('express-fileupload');
const uuidv4 = require('uuid').v4;
const cors = require('cors');

app.use(uploader());
app.use(cors()); 

const fs = require('fs');

// helpers
function getUniqueFilename(fileName)
{
    const extension = fileName.split('.').pop();
    return `${uuidv4()}.${extension}`;
}

// const acceptedMime = ['image/jpeg', 'image/png'];

app.use(express.static('upload'));

const userList = [];

// routes
app.get('/', (req, res) => {
    res.send(userList);
});
app.post('/', (req, res) => {
    const fileName = `/images/${getUniqueFilename(req.files.photo.name)}`;
    req.files.photo.mv(`${__dirname}/upload/${fileName}`, (err) => {
        if (err)
        {
            return res.status(500).send("File Upload Failed")
        }
        else
        {
            userList.push({'id': uuidv4(), 'email':req.body.email, 'photo': fileName});
            return res.send("File Uploaded Successfully")
        }
    });
})

app.delete('/user/:id', (req, res) => {
    const id = req.params.id;
    const user = userList.find(user => user.id === id);
    if (user)
    {
        userList.splice(userList.indexOf(user), 1);
        fs.unlinkSync(`${__dirname}/upload/${user.photo}`);
        return res.send("User Deleted Successfully");
    }
    else
    {
        return res.status(404).send("User Not Found");
    }
})


app.listen(port);