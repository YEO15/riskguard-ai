const express = require("express"); 
const cors = require("cors"); 
const app = express(); 
app.use(cors()); 
app.use(express.json()); 
app.post("/api/analyze", async (req, res) => { 
  try { 
    const r = await fetch("https://api.anthropic.com/v1/messages", { 
      method: "POST", 
      headers: {"Content-Type":"application/json","x-api-key":process.env.ANTHROPIC_API_KEY||"","anthropic-version":"2023-06-01"}, 
      body: JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,messages:req.body.messages}) 
    }); 
    res.json(await r.json()); 
  } catch(e) { res.status(500).json({error:e.message}); } 
}); 
app.listen(3001, () => console.log("Proxy demarre sur http://localhost:3001"));
