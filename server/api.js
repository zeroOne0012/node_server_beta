const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// data path
const dataFilePath = path.join(__dirname, '/data/resources.json');


// data(JSON 파일) 관리
const readData = () => {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
};

const find = (id) =>{
    const data = readData();
    for(json in data){
        if(json==id){
            return true;
        }
    }
    return false;
};

const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
};




router.get('/get', (req, res) => {

    const data = readData();
    res.status(200).json(data);
});


router.post('/post', (req, res) => {
    
    const newResource = req.body;

    console.log(find(newResource.id));

    find(newResource.id) ? res.status(400).json({message: 'Wrong Resource', resource: newResource}):
    res.status(201).json({ message: 'Resource added', resource: newResource });
});

router.delete('/delete/:id', (req, res) => {
    const data = readData();
    const resourceId = parseInt(req.params.id);


    resourceId==data.id ? res.status(200).json({ message: 'Resource deleted' }) : (res.status(404).json({ message: 'Resource not found' }));
});

router.patch('/patch/:id', (req, res) => {
    const data = readData();
    const resourceId = parseInt(req.params.id);


    res.status(200).json(data);
});


module.exports = router;









