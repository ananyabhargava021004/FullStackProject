const { exec } = require("child_process");

const executePython = async (filePath, input = "") => {
  return new Promise((resolve, reject) => {
    const runProcess = exec(`python "${filePath}"`, (error, stdout, stderr) => {
      if (error) return reject({ error, stderr });
      if (stderr) return reject(stderr);
      resolve(stdout);
    });

    // Write custom input to stdin if provided
    if (input) {
      runProcess.stdin.write(input);
    }
    runProcess.stdin.end();
  });
};

module.exports = executePython;
