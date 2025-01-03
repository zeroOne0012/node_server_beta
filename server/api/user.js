const express = require('express');
const router = express.Router();

const { Client } = require("pg");
require('dotenv').config();
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
client.connect();

router.get('/', async (req, res) => {
    console.log("DEBUG");
    try{
        const query = `
        SELECT *
        FROM USERS;
        `;

        const {rows} = await client.query(query);
        // console.log(rows);
        res.status(200).json(rows);
    }catch(err){
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.get('/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const query = `
        SELECT *
        FROM USERS
        WHERE USER_ID=$1;
        `;

        const {rows} = await client.query(query, [id]);
        if(rows.length===0){
            return res.status(404).send('Bad Request');
        }
        res.status(200).json(rows[0]);
    }catch(err){
        console.log(err);
        res.status(500).send('Server Error');
    }
});


router.post('/', async (req, res) => {
    try{
        const { username, password } = req.body;
        const query=`
        INSERT INTO USERS (USERNAME, PASSWORD)
        VALUES($1, $2) returning *;
        `;

        const {rows} = await client.query(query, [username, password]);
        res.status(201).json(rows[0]);
    }catch(err){
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const query = `
        DELETE FROM USERS
        WHERE USER_ID=$1 returning *;
        `;
        const {rows} = await client.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).send('Bad Request');
        }
        res.status(200).json(rows[0]);
    }catch(err){
        console.log(err);
        res.status(500).send('Server Error');
    }
});

router.patch('/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const { username, password } = req.body;
        const query = `
        UPDATE USERS
        SET USERNAME = $1, PASSWORD = $2
        WHERE USER_ID=$3 returning *;
        `;
        const {rows} = await client.query(query, [username, password, id]);

        if (rows.length === 0) {
            return res.status(404).send('Bad Request');
        }
        res.status(200).json(rows[0]);
    }catch(err){
        console.log(err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;

