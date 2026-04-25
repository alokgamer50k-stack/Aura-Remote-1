const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let usersData = {};

// Tracker
app.use((req, res, next) => {
    console.log("🛑 GAME KI REQUEST AAYI: ", req.url);
    next();
});

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

// 🔥 THE MIDDLE-MAN MAGIC
app.get('/ver.php', async (req, res) => {
    try {
        console.log("➡️ Garena se asli data lene ja rahe hain...");
        
        // Garena ke asli server se wahi same request maangna
        const targetUrl = 'https://dl.dir.freefiremobile.com' + req.url;
        const response = await fetch(targetUrl);
        const data = await response.text();

        try {
            // Asli file ko kholna
            let jsonData = JSON.parse(data);
            console.log("✅ Asli data mil gaya! Ab isme apna VIP hack dalenge...");

            // Apna fake data inject karna
            jsonData.unlockAll = true;
            jsonData.bypassLogin = true;
            if(!jsonData.playerStats) jsonData.playerStats = {};
            jsonData.playerStats.diamonds = 999999;
            jsonData.playerStats.gold = 999999;
            jsonData.vBadge = true;

            // Game ko modified data wapas bhej dena
            res.json(jsonData);
        } catch (e) {
            console.log("⚠️ Data JSON nahi tha, direct forward kar rahe hain.");
            res.send(data);
        }
    } catch (error) {
        console.log("❌ Proxy Error:", error.message);
        res.status(500).send("Server Error");
    }
});

// Baaki sab kuch (Assets, Login) seedha Garena se aayega
app.use('*', createProxyMiddleware({
    target: 'https://dl.dir.freefiremobile.com/', 
    changeOrigin: true,
    logLevel: 'debug'
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`VIP PROXY is running on port ${PORT}`);
});
            
