const express = require('express');
const app = express();

// Ye wo endpoint hai jo Free Fire configuration bhejega
app.get('/config', (req, res) => {
    res.json({
        "verAddr": "https://version.astutech.online/", // Yahan tum apna address bhi dal sakte ho baad mein
        "resetGuest": true,
        "bypassLogin": true,
        "unlockAll": true
    });
});

// Home page par bas dikhane ke liye ki server chal raha hai
app.get('/', (req, res) => {
    res.send("FF Private Config Server is Online!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
