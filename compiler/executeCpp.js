const fs= require("fs");
const path = require("path");
const { exec }= require("child_process"); // create instance where we can perform set of instructions
// using execute method here 


const outputPath = path.join(__dirname,"output"); //C:\Users\Ananya Bhargava\OneDrive\Desktop\Auth\compiler\output

if(!fs.existsSync(outputPath)){ 
    fs.mkdirSync(outputPath,{recursive: true}); 
}

const executeCpp = async(filePath, input) => { // "filePath": "C:\\Users\\Ananya Bhargava\\OneDrive\\Desktop\\Auth\\compiler\\codes\\06fb8997-595a-434d-9c4a-2275e4779854.cpp"
    const jobId = path.basename(filePath).split(".")[0]; // [06fb8997-595a-434d-9c4a-2275e4779854.cpp"] - 0th index mei aajayega 
    const outPath= path.join(outputPath, `${jobId}.out`); 
    //..Desktop\Auth\compiler\outputs\06fb8997-595a-434d-9c4a-2275e4779854.out
    const outputFilename = `${jobId}.out`;
    return new Promise((resolve, reject) => { // jo bhi output hoga usko outPath mei store krdo
        // Compile the code first
    exec(`g++ "${filePath}" -o "${outPath}"`, (compileErr, _, compileStderr) => {
      if (compileErr || compileStderr) {
        return reject({ error: compileErr, stderr: compileStderr });
      }

      // Now run the compiled binary and pass input via stdin
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

module.exports = executeCpp;