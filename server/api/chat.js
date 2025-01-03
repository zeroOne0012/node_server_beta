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

router.get('/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const query = `
        SELECT u.username, cm.msg, cm.created_on
        FROM USERS u
        JOIN CHAT_MSG cm ON u.user_id = cm.user_id
        WHERE cm.chat_id = $1;
        `;

        const {rows} = await client.query(query, [id]);
        res.status(200).json(rows);
    }catch(err){
        console.log(err);
        res.status(500).send('Server Error');
    }
});
router.delete('/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const query = `
        DELETE FROM CHAT_MSG
        WHERE CHAT_ID = $1;
        `;

        const {rows} = await client.query(query, [id]);
        res.status(200).send('Chat Cleared');
    }catch(err){
        console.log(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

