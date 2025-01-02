const express = require('express');
const router = express.Router();

// 임시 DB
let database = [
    {
        "id":1,
        "content":"content1"
    }
];


const find = (id) =>{
    id = parseInt(id);
    for(const json of database){
        if(json.id===id){
            return json;
        }
    }
    return null;
};


router.get('/', (req, res) => {
    res.status(200).json(database);
});

router.get('/get/:id', (req, res) => {
    // const targetId = parseInt(req.params.id);
    // const target = database.find((item) => item.id === targetId);
    const target = find(req.params.id);

    if (target==null) {
        return res.status(400).json({message: 'Resource not found'});
    }
    
    res.status(200).json(database);
});


router.post('/post', (req, res) => {
    const newData = req.body;

    if(find(newData.id)!=null){
        return res.status(400).json({message: 'Bad Request'});
    }

    database.push(newData);

    res.status(201).json({ message: 'Resource added', resource: newData });
});

router.delete('/delete/:id', (req, res) => {
    const targetId = parseInt(req.params.id); 
    const target = database.find((item) => item.id === targetId);

    if (!target) {
        return res.status(400).json({ message: 'No resource to delete' });
    }

    database = database.filter((item) => item.id !== targetId); // 새 배열로 교체

    res.status(200).json({ message: 'Resource deleted', resource: target });
    // res.status(204).send();
});

router.patch('/patch/:id', (req, res) => {
    const patchData = req.body;
    const target = find(req.params.id);

    if(target==null || req.params.id!=req.body.id){
        return res.status(400).json({message: 'Bad request'});
    }

    Object.assign(target, patchData); // 기존 데이터에 patchData 병합

    res.status(200).json({ message: 'Resource patched', resource: target });
});


module.exports = router;









