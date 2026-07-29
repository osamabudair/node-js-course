const express = require('express');
const logger = require("./middlewares/logger");
const { notFound, errorHandler } = require("./middlewares/errors");
const dotenv = require("dotenv").config();
const connectToDB = require('./config/db');

// Connection To Database
connectToDB();

// Init App
const app = express();

//Apply Middlewares
app.use(express.json());

//Custom Middleware
app.use(logger);

// Routes
app.use("/api/books", require("./routes/books"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));

// Error Handler Middleware
app.use(notFound);

app.use(errorHandler);

// Running Teh Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
  console.log(`Server is running ${process.env.NODE_ENV} mode on port ${PORT}`);
});