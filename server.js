const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tracker
app.use((req, res, next) => {
    console.log("🛑 GAME KI REQUEST AAYI: ", req.originalUrl);
    next();
});

let usersData = {};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

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

// 🔥 THE FIX: Game ko yahan se Fake Config milegi!
app.get('/ver.php', (req, res) => {
    console.log("✅ FAKE CONFIG BHEJA GAYA!");
    res.json({
        "status": "success",
        "loginAllowed": true,
        "bypassLogin": true,
        "unlockAll": true,
        "resetGuest": true,
        "playerStats": { "diamonds": 999999, "gold": 999999 },
        "verAddr": "https://vip-proxy-server.onrender.com/"
    });
});

// Proxy target (Baaki sab Garena se load hoga)
app.use('*', createProxyMiddleware({
    target: 'https://dl.dir.freefiremobile.com/', 
    changeOrigin: true,
    logLevel: 'debug'
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`VIP PROXY is running on port ${PORT}`);
});
