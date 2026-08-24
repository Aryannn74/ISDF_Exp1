const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const initSqlJs = require("sql.js");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let db;
// INITIALIZE DATABASE
async function initializeDatabase() {

    const SQL = await initSqlJs({
        locateFile: file =>
            path.join(__dirname, "node_modules", "sql.js", "dist", file)
    });

    const databasePath = path.join(__dirname, "passwords.sqlite");
    // Load existing database if it exists
    if (fs.existsSync(databasePath)) {
        const fileBuffer = fs.readFileSync(databasePath);
        db = new SQL.Database(fileBuffer);
        console.log("Existing database loaded.");

    } else {
        db = new SQL.Database();
        console.log("New database created.");

    }

    // Create users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            salt TEXT NOT NULL,
            password_hash TEXT NOT NULL
        )
    `);

    saveDatabase();
    console.log("Users table ready.");
}

// SAVE DATABASE TO DISK

function saveDatabase() {
    const databasePath =
        path.join(__dirname, "passwords.sqlite");
    const data = db.export();
    fs.writeFileSync(
        databasePath,
        Buffer.from(data)
    );
}

// PASSWORD STRENGTH ANALYSIS

function calculatePasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) {
        score++;
    }
    if (/[A-Z]/.test(password)) {
        score++;
    }
    if (/[a-z]/.test(password)) {
        score++;
    }
    if (/[0-9]/.test(password)) {
        score++;
    }
    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }
    if (score <= 2) {
        return "LOW";
    } else if (score <= 4) {
        return "MEDIUM";
    } else {
        return "HIGH";
    }
}

// HASH PASSWORD USING PBKDF2

function hashPassword(password, salt) {
    return crypto.pbkdf2Sync(
        password,
        salt,
        100000,
        64,
        "sha512"
    ).toString("hex");
}

// REGISTER USER

app.post("/register", (req, res) => {
    const { username, password } = req.body;
    // Validate input
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required."
        });

    }

    // Analyze password strength
    const strength =
        calculatePasswordStrength(password);

    // Generate a random salt
    const salt =
        crypto.randomBytes(16).toString("hex");

    // Generate password hash
    const passwordHash =
        hashPassword(password, salt);

    try {
        // Store username, salt and hash
        db.run(
            `INSERT INTO users
             (username, salt, password_hash)
             VALUES (?, ?, ?)`,
            [
                username,
                salt,
                passwordHash
            ]
        );

        saveDatabase();

        console.log("\n================================");
        console.log("NEW USER REGISTERED");
        console.log("================================");
        console.log("Username:", username);
        console.log("Password Strength:", strength);
        console.log("Salt:", salt)
        console.log("Password Hash:", passwordHash);
        console.log("================================\n");


        res.json({
            success: true,
            message: "Registration successful.",
            strength: strength,
            salt: salt,
            hash: passwordHash
        });


    } catch (error) {
        if (
            error.message.includes("UNIQUE")
        ) {

            return res.status(409).json({
                success: false,
                message: "Username already exists."

            });

        }

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database error."
        });
    }

});

// LOGIN

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required."
        });

    }

    try {
        const result =
            db.exec(
                `SELECT username, salt, password_hash
                 FROM users
                 WHERE username = ?`,
                [username]
            );

        if (
            result.length === 0 ||
            result[0].values.length === 0
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });

        }

        const row =
            result[0].values[0];
        const storedSalt =
            row[1];
        const storedHash =
            row[2];
        const enteredPasswordHash =
            hashPassword(
                password,
                storedSalt
            );

        if (
            enteredPasswordHash === storedHash
        ) {
            return res.json({
                success: true,
                message: "Login successful."

            });
        }


        return res.status(401).json({
            success: false,
            message: "Invalid username or password."
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Database error."
        });
    }
});

// START SERVER

initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log("--------------------------------");
            console.log("PASSWORD SECURITY EXPERIMENT");
            console.log("--------------------------------");
            console.log(
                `Server running at http://localhost:${PORT}`
            );
        });

    })
    .catch(error => {
        console.error(
            "Failed to initialize database:",
            error
        );
    });
