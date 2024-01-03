const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

// Connect to MongoDB
mongoose.connect(MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
});
const authMiddleware = require('./middleware/authMidlleware');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/ProductRoute');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
const protectedRoute = require('./routes/protectedRoute');
const authRoute = require('./routes/auth');
// middleware
const myMiddleware = (req,res,next)=>{
    console.log("Hello from my middleware");
    next();
}
// Initialize express
const app = express()



app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// build-in middleware for serving static files (images, css, js) from uploads folder to the client
app.use('/api/images', express.static('uploads'));
// call all routes
app.use('/api/v1/categories',categoryRoutes);
app.use('/api/v1/products',productRoutes);
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/uploads',fileRoutes);
app.use('/api/v1/protected', protectedRoute)
app.use('/api/v1/auth', authRoute)

app.use(myMiddleware);
app.get('/',(req,res)=>{
    res.send("Hello World");
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})