const express = require('express');
const app = express();
app.use(express.json()); // JSON data receive karne ke liye
app.use(express.urlencoded({ extended: true }));

// Ye hamara temporary database hai jahan saari UIDs ka data save hoga
let usersData = {};

// 1. Dashboard (Web UI) Dikhane ke liye
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 2. Dashboard se data SAVE karne ke liye (Save Button)
app.post('/api/updateUser', (req, res) => {
    const { uid, isUnlocked, diamonds, gold, level, vBadge } = req.body;
    
    usersData[uid] = {
        isUnlocked: isUnlocked === 'true' || isUnlocked === true,
        diamonds: parseInt(diamonds),
        gold: parseInt(gold),
        level: parseInt(level),
        vBadge: vBadge === 'true' || vBadge === true
    };
    
    res.json({ success: true, message: `UID ${uid} Updated!`, data: usersData[uid] });
});

// 3. Game jab data maangega (Free Fire Client Config)
// Game ki file yahan request bhejegi tumhare link par
app.get('/config/:uid', (req, res) => {
    const uid = req.params.uid;
    const user = usersData[uid];

    // Agar UID server par nahi hai ya locked hai
    if (!user || !user.isUnlocked) {
        return res.json({
            "status": "locked",
            "message": "Unlock your UID and play. Visit dashboard.",
            "loginAllowed": false
        });
    }

    // Agar UID unlocked hai, toh usko fake data bhej do
    res.json({
        "status": "success",
        "loginAllowed": true,
        "playerStats": {
            "diamonds": user.diamonds,
            "gold": user.gold,
            "level": user.level,
            "vBadge": user.vBadge
        },
        "verAddr": "https://tumhara-asset-server.com/",
        "unlockAll": true
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
  
