const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let usersData = {};

// 1. Dashboard (VIP PROXY UI)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 2. Data Save Karne Ke Liye
app.post('/api/updateUser', (req, res) => {
    const { uid, isUnlocked, diamonds, gold, level, vBadge } = req.body;
    usersData[uid] = {
        isUnlocked: isUnlocked === 'true',
        diamonds: parseInt(diamonds),
        gold: parseInt(gold),
        level: parseInt(level),
        vBadge: vBadge === 'true'
    };
    res.json({ success: true, message: `UID ${uid} Updated!`, data: usersData[uid] });
});

// 3. THE 404 FIX (Catch-All Route)
// Game koi bhi version file mange, server ye fake data bhej dega
app.get('*', (req, res) => {
    res.json({
        "version": "99.99.99",
        "verAddr": "https://vip-proxy-server.onrender.com/",
        "status": "success",
        "loginAllowed": true,
        "bypassLogin": true,
        "unlockAll": true,
        "resetGuest": true,
        "playerStats": {
            "diamonds": 999999,
            "gold": 999999
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
