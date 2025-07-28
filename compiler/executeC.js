const fs= require("fs");
const path = require("path");
const { exec }= require("child_process"); 


const outputPath = path.join(__dirname,"output"); 

if(!fs.existsSync(outputPath)){ 
    fs.mkdirSync(outputPath,{recursive: true}); 
}

const executeC = async(filePath) => { // "filePath": "C:\\Users\\Ananya Bhargava\\OneDrive\\Desktop\\Auth\\compiler\\codes\\06fb8997-595a-434d-9c4a-2275e4779854.cpp"
    const jobId = path.basename(filePath).split(".")[0]; // [06fb8997-595a-434d-9c4a-2275e4779854.cpp"] - 0th index mei aajayega 
    const outPath= path.join(outputPath, `${jobId}.out`); 
    //..Desktop\Auth\compiler\outputs\06fb8997-595a-434d-9c4a-2275e4779854.out
    const outputFilename = `${jobId}.out`;
    return new Promise((resolve, reject) => { // jo bhi output hoga usko outPath mei store krdo
      exec(`gcc "${filePath}" -o "${outPath}"`, (compileErr, _, compileStderr) => {
      if (compileErr || compileStderr) {
        return reject({ error: compileErr, stderr: compileStderr });
      }

      // Now run the compiled executable, pass input via stdin
      const runProcess = exec(`"${outPath}"`, (runErr, stdout, runStderr) => {
        if (runErr) {
          return reject({ error: runErr, stderr: runStderr });
        }
        if (runStderr) {
          return reject({ stderr: runStderr });
        }
        resolve(stdout);
      });

      // Feed custom input into stdin
      if (input) {
        runProcess.stdin.write(input);
      }
      runProcess.stdin.end();
    });
  });
};

module.exports = executeC;