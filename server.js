const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
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

// 3. REVERSE PROXY (Asli Khel)
// Agar game config mangega, toh hum apna data denge
app.get('/config', (req, res) => {
    res.json({
        "status": "success",
        "loginAllowed": true,
        "playerStats": { "diamonds": 999999, "gold": 999999 }
    });
});

// Baaki jo kuch bhi game mangega (Assets, Login, Maps), wo hum Garena ko bhej denge!
app.use('*', createProxyMiddleware({
    target: 'https://dl.dir.freefiremobile.com/', // Ye Garena ka asli server link hai
    changeOrigin: true,
    logLevel: 'debug'
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`VIP PROXY is running on port ${PORT}`);
});
