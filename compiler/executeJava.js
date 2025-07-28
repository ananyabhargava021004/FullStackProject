const { exec } = require("child_process");
const path = require("path");

const executeJava = async (filePath, input = "") => {
  const jobId = path.basename(filePath).split(".")[0];
  const dir = path.dirname(filePath);
  const fileNameWithoutExt = path.basename(filePath, ".java");

  return new Promise((resolve, reject) => {
    // Compile the Java file first
    exec(`javac "${filePath}"`, (compileErr, _, compileStderr) => {
      if (compileErr || compileStderr) {
        return reject({ error: compileErr, stderr: compileStderr });
      }

      // Run the compiled Java program and pass input via stdin
      const runProcess = exec(`java -cp "${dir}" ${fileNameWithoutExt}`,
        (runErr, stdout, runStderr) => {
          if (runErr) {
            return reject({ error: runErr, stderr: runStderr });
          }
          if (runStderr) {
            return reject({ stderr: runStderr });
          }
          resolve(stdout);
        });

      // Send custom input to stdin
      if (input) {
        runProcess.stdin.write(input);
      }
      runProcess.stdin.end();
    });
  });
};

module.exports = executeJava;
