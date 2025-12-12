const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'Art_Gallery',
    resave: true,
    saveUninitialized: true
}));

mongoose.connect('mongodb://localhost:27017/MyBackEndDatabase', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

// Use a known safe prime (2048-bit) and generator
const p = BigInt('0xFFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A63A36210000000000090563');
const g = BigInt(2);

// Generate keys
function generateKeys() {
    const x = BigInt('0x' + Array(64).fill(null).map(() => Math.floor(Math.random() * 16).toString(16)).join('')); // Private key
    const y = modExp(g, x, p); // Public key
    return { p, g, x, y };
}

// Modular exponentiation
function modExp(base, exp, mod) {
    let result = BigInt(1);
    base = base % mod;
    while (exp > 0) {
        if (exp % BigInt(2) === BigInt(1)) {
            result = (result * base) % mod;
        }
        exp = exp >> BigInt(1);
        base = (base * base) % mod;
    }
    return result;
}

// Encrypt message
function encrypt(message, p, g, y) {
    const m = BigInt('0x' + Buffer.from(message).toString('hex')); // Convert message to bigint
    const k = BigInt('0x' + Array(64).fill(null).map(() => Math.floor(Math.random() * 16).toString(16)).join('')); // Random k

    const a = modExp(g, k, p); // a = g^k mod p
    const b = (m * modExp(y, k, p)) % p; // b = m * y^k mod p

    return { a, b };
}

// Decrypt message
function decrypt(a, b, p, x) {
    const s = modExp(a, x, p); // s = a^x mod p
    const sInverse = modInverse(s, p);
    const m = (b * sInverse) % p; // m = b * s^-1 mod p

    return Buffer.from(m.toString(16), 'hex').toString(); // Convert bigint to message
}

// Calculate modular inverse using the Extended Euclidean Algorithm
function modInverse(a, m) {
    let m0 = m;
    let y = BigInt(0);
    let x = BigInt(1);

    if (m === BigInt(1)) return BigInt(0);

    while (a > BigInt(1)) {
        const q = a / m;
        let t = m;

        m = a % m;
        a = t;
        t = y;

        y = x - q * y;
        x = t;
    }

    if (x < BigInt(0)) x += m0;

    return x;
}

// Register Route
app.post("/register", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    db.collection("login").findOne({ email: email }, (err, result) => {
        if (err) {
            throw err;
        }
        if (result) {
            return res.send("<script>alert('User already exists'); window.location.href='/login.html';</script>");
        } else {
            const { p, g, x, y } = generateKeys(); // Generate keys
            const { a, b } = encrypt(password, p, g, y); // Encrypt password

            var data = {
                name: name,
                email: email,
                p: p.toString(),
                g: g.toString(),
                x: x.toString(),
                y: y.toString(),
                a: a.toString(),
                b: b.toString()
            };
            db.collection("login").insertOne(data, (err, collection) => {
                if (err) {
                    throw err;
                }
                console.log("Data Inserted Successfully");
                return res.redirect("fs.html");
            });
        }
    });
});

// Login Route
app.post("/login", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
  
    db.collection("login").findOne({ email: email }, (err, user) => {
      if (err) {
        throw err;
      }
      if (!user) {
        return res.send("<script>alert('User not found'); window.location.href='/login.html';</script>");
      } else {
        const { p, g, x, y, a, b } = user;
        const decryptedPassword = decrypt(BigInt(a), BigInt(b), BigInt(p), BigInt(x));
        console.log(Decrypted password: ${decryptedPassword}); // Log the decrypted password for verification
        if (password === decryptedPassword) {
          req.session.user = email;
          return res.redirect("fs1.html");
        } else {
          return res.send("<script>alert('Incorrect password'); window.location.href='/login.html';</script>");
        }
      }
    });
});

// Logout Route
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

// Default Route
app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('fs.html');
});

const server = app.listen(3077, () => {
    console.log("Listening on port 3077");
});