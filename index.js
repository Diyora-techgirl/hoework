const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admins")
const productRoutes = require("./routes/product/product")
const categoryRoutes = require("./routes/category/category")
const frontEndRoutes = require("./routes/product/UserProduct")
const app = express();
app.use(express.json());
const url = process.env.PORT

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:4000']; 
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) { 
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'] 
  }));


mongoose.connect(url)
.then(()=>{
    console.log("db connected")
})
.catch((err)=>{
    console.log(err, "error")
})

app.listen(3001, () => {
  console.log(`Server listening on port 3001`);
});

app.use("/user", userRoutes);
app.use("/admin", adminRoutes)
app.use('/dashboard', productRoutes);
app.use('/frontend', frontEndRoutes)
app.use('/dashboard/category', categoryRoutes);
app.use('/frontend/category', categoryRoutes);