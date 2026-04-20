const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const RED = require('node-red');

dotenv.config();

const app = express();
const server = http.createServer(app);


const settings = {
    httpAdminRoot: "/red",
    httpNodeRoot: "/api",
    userDir: "./.node-red",
    functionGlobalContext: { }
};


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todoApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/todos', require('./routes/todoRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/visions', require('./routes/visionRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


RED.init(server, settings);
app.use(settings.httpAdminRoot, RED.httpAdmin);
app.use(settings.httpNodeRoot, RED.httpNode);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Node-RED is available at http://localhost:${PORT}/red`);
});

RED.start();
