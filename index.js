const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config();

//Set up a server
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
}));

//Connect to mongoDB
mongoose.connect(process.env.MDB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, (err) => {
        if (err) return console.error(err);
        console.log("Connected to mongoDB");
    });

//Routes
app.get("/test", (req, res) => {
    res.send("It works");
});
app.use("/auth", require("./Routes/userRouter"));
app.use("/customer", require("./Routes/customerRouter"));

