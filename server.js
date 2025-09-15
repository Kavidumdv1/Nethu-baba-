const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Deploy MINI BOT API
app.post('/api/deploy-mini-bot', (req,res)=>{
    const {username, sessionId} = req.body;
    if(!username || !sessionId){
        return res.json({success:false,message:"Name or Session ID missing"});
    }

    // Spawn the mini-bot process
    const botProcess = spawn('node', ['mini-bot.js', username, sessionId]);

    botProcess.stdout.on('data', data=>{
        console.log(`BOT: ${data}`);
    });
    botProcess.stderr.on('data', data=>{
        console.error(`ERROR: ${data}`);
    });
    botProcess.on('close', code=>{
        console.log(`BOT exited with code ${code}`);
    });

    res.json({success:true,message:"Mini Bot deployment started"});
});

// Serve index.html
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
});

// Heroku dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
