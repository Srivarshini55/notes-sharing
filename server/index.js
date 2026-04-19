const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));


// ================= MULTER SETUP =================
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const SECRET = "secretkey";


// ================= AUTH =================

// SIGNUP
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ message: "All fields required" });
        }

        // 🔍 CHECK IF USER ALREADY EXISTS
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.json({ message: "User already exists" });
        }

        // 🔐 HASH PASSWORD
        const hashed = await bcrypt.hash(password, 10);

        // 💾 INSERT USER
        await pool.query(
            "INSERT INTO users (name,email,password) VALUES ($1,$2,$3)",
            [name, email, hashed]
        );

        res.json({ message: "Signup successful" });

    } catch (err) {
        console.error(err); // 🔥 helps debugging
        res.json({ message: "Signup failed" });
    }
});


// LOGIN
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        if (user.rows.length === 0) {
            return res.json({ message: "Invalid credentials" });
        }

        const valid = await bcrypt.compare(password, user.rows[0].password);

        if (!valid) {
            return res.json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.rows[0].id }, SECRET);

        res.json({
            message: "Login successful",
            token,
            name: user.rows[0].name
        });

    } catch (err) {
        res.json({ message: "Error logging in" });
    }
});


// ================= UPLOAD =================

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { subject_code, regulation } = req.body;

        if (!req.file) {
            return res.json({ message: "File required" });
        }

        if (!subject_code || !regulation) {
            return res.json({ message: "All fields required" });
        }

        const count = await pool.query(
            "SELECT COUNT(*) FROM notes WHERE subject_code=$1",
            [subject_code]
        );

        const noteNumber = parseInt(count.rows[0].count) + 1;

        await pool.query(
            "INSERT INTO notes (subject_code, regulation, file_path, note_number) VALUES ($1,$2,$3,$4)",
            [subject_code, regulation, req.file.filename, noteNumber]
        );

        res.json({ message: "Upload successful" });

    } catch (err) {
        res.json({ message: "Upload failed" });
    }
});


// ================= VIEW NOTES =================

app.get('/notes', async (req, res) => {
    try {
        const { subject_code, regulation } = req.query;

        const result = await pool.query(
            "SELECT * FROM notes WHERE subject_code=$1 AND regulation=$2",
            [subject_code, regulation]
        );

        res.json(result.rows);

    } catch (err) {
        res.json([]);
    }
});


// ================= DOWNLOAD ROUTE =================
// This forces file download (instead of just opening)

app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ message: "File not found" });
    }
});


// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});