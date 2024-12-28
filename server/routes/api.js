// routes/api.js
const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

// GET /api/users
router.get('/users', (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = '取得所有使用者資料'
    res.json([
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' }
    ]);
});

// POST /api/users
router.post('/users', (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = '新增使用者'
    res.json({ message: '使用者建立成功' });
});

module.exports = router;