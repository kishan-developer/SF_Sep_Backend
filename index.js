const express = require("express");
const cookieParser = require("cookie-parser");
const fileUplaod = require("express-fileupload");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");

const notFound = require("./middleware/notFound.middleware");
const sendCustomResponse = require("./middleware/customResponse.middleware");
const connectDB = require("./config/connectDb");
require("dotenv").config();


const {
    globalErrorHandler,
} = require("./middleware/globalErrorHandler.middleware");


const router = require("./routes/index.routes");

// Connect Database
connectDB(); // connect Database


const app = express();

// use compresstion
app.use(compression());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const allowedOrigins = ["http://localhost:5173",'https://srijanfabs.in','https://srijanfabs.com'];

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);



// Secure HTTP headers to protect your app
app.use(helmet());

// Sanitize input to prevent NoSQL injection attacks

// Handle file uploads, with temporary storage for large files
app.use(
    fileUplaod({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

app.use(sendCustomResponse);
// Routes For Login, Register, Send-Otp, Forgott-Password, Reset Password

// Stating from this route localhost:8000/api/v1/auth/register
app.use("/api/v1", router);

app.get("/", (req, res) => {
    res.send("Welcome to the API root");
});

app.use(notFound);
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5679;

app.listen(PORT, (err) => {
    console.log(`Server running on http://localhost:${PORT}`);
});
