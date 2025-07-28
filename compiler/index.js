const express= require("express");
const cors = require('cors');
const generateFile = require("./generateFile");
const executeCpp= require("./executeCpp");
const executeC=require("./executeC");
const executeJava=require("./executeJava");
const executePython=require("./executePython")
const generateAiResponse= require("./generateAiResponse")
const dotenv=require("dotenv");
const app= express();
dotenv.config();
const PORT = process.env.PORT || 8081;

// middlewares
app.use(cors({
  origin: ["http://localhost:5173", "https://onlinejudgeproject.vercel.app"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// for checking health
app.get("/",(req,res)=> { 
  res.json({ online: 'compiler'});
});

// compiles and executes c++ code
app.post("/run", async (req,res)=> {
    const { language='cpp', code, input= "" } = req.body;
    if(code === undefined){
      return res.status(400).json({success:false, error:"Empty code body"});
    }
    try{
      const filePath = generateFile(language,code);
      let output;
      if(language === "cpp"){
        output= await executeCpp(filePath,input);
      } else if(language === "c"){
        output= await executeC(filePath,input);
      } else if(language === "java"){
        output = await executeJava(filePath,input);
      } else {
        output= await executePython(filePath,input);
      }
      res.json({ success:true, filePath, output });
    } catch ( error){
      console.error("Execution error:", error);
      res.status(500).json({success:false, 
        error: error.stderr || error.message || "Unknown error occurred",
      });
    }
});

app.post("/ai-review",async (req, res) => {
  const {code} = req.body;
  if(code === undefined || code.trim() === ''){
    return res.status(400).json({
      success: false,
      error: "Empty code ! Please provide some code to review."
    });   
  }
  try{
    const aiResponse = await generateAiResponse(code);
    res.json({
      success: true,
      aiResponse
    })
  }catch(error){
    console.error('Error executing code', error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



