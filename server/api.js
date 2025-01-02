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

const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
};




router.get('/get', (req, res) => {
    // console.log("TEST_PATH", dataFilePath);
    // console.log("DIR_NAME",__dirname);
    const data = readData();
    res.status(200).json(data);
});


router.post('/post', (req, res) => {
    
    const data = readData();
    const newResource = req.body;
    
    // ID 생성 (중복 방지)
    const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
    newResource.id = newId;
    
    // writeData(data);

    res.status(201).json({ message: 'Resource added', resource: newResource });
});

router.delete('/delete/:id', (req, res) => {
    const data = readData();
    const resourceId = parseInt(req.params.id);

    // const index = data.findIndex((item) => item.id === resourceId);
    // if (index === -1) {
    //     return res.status(404).json({ message: 'Resource not found' });
    // }

    // data.splice(index, 1);
    // writeData(data);

    // res.status(200);
    resourceId==data.id ? res.status(200).json({ message: 'Resource deleted' }) : (res.status(404).json({ message: 'Resource not found' }));
});

router.patch('/patch/:id', (req, res) => {
    const data = readData();
    const resourceId = parseInt(req.params.id);

    // const resource = data.find((item) => item.id === resourceId);
    // if (!resource) {
    //     return res.status(404).json({ message: 'Resource not found' });
    // }

    res.status(200).json(data);
    // Object.assign(resource, req.body); // 업데이트
    // writeData(data);

    // res.status(200).json({ message: 'Resource updated', resource });
});

// router.get('/get', (req, res) => {
//     res.send('get endpoint');
// });
// router.post('/post', (req, res) => {
//     res.send('post endpoint');
// });
// router.delete('/delete', (req, res) => {
//     res.send('delete endpoint');
// });
// router.patch('/patch', (req, res) => {
//     res.send('patch endpoint');
// });

module.exports = router;









