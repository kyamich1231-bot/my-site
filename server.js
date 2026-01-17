const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Хранилище
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./"),
    filename: (req, file, cb) => cb(null, "uploaded_" + file.originalname)
});

const upload = multer({ storage });

app.use(express.static(__dirname));

app.post("/upload", upload.single("file"), (req, res) => {
    res.send("OK");
});

app.get("/files", (req, res) => {
    res.sendFile(path.join(__dirname, "uploaded_" + req.query.name));
});

app.listen(PORT, () => {
    console.log("Server started");
});
