const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000; // Dùng biến môi trường cho port nếu có

// Sử dụng middleware CORS
app.use(cors());

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Đã kết nối với MongoDB'))
    .catch(err => console.log('Lỗi kết nối MongoDB:', err));

// Middleware
app.use(bodyParser.json());

// Định nghĩa schema và model cho items
const itemSchema = new mongoose.Schema({
    id: Number,
    value: String,
    count: Number,
});

const Item = mongoose.model('Item', itemSchema);

// API lưu items vào MongoDB
app.post('/saveItems', async (req, res) => {
    try {
        const items = req.body.items;
        await Item.deleteMany({}); // Xóa dữ liệu cũ
        await Item.insertMany(items); // Lưu dữ liệu mới

        res.status(200).send({ message: 'Đã lưu vào MongoDB!' });
    } catch (error) {
        res.status(500).send({ message: 'Lỗi khi lưu vào MongoDB', error });
    }
});

// API lấy tất cả items từ MongoDB
app.get('/getItems', async (req, res) => {
    try {
        const items = await Item.find(); // Lấy tất cả items từ MongoDB
        res.status(200).json({ items });  // Gửi danh sách items về frontend
    } catch (error) {
        res.status(500).send({ message: 'Lỗi khi lấy dữ liệu từ MongoDB', error });
    }
});

// Chạy server
app.listen(port, () => {
    console.log(`Server đang chạy tại ${process.env.API_URL || `http://localhost:${port}`}`);
});
