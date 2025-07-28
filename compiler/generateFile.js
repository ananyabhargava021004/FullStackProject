const fs = require("fs"); //helps to interact with file system
const path = require("path"); // helps to get path of any file - path module
const {v4: uuid} = require("uuid"); // mapped v4 to uuid

const dirCodes = path.join(__dirname,"codes"); //C:\Users\Ananya Bhargava\OneDrive\Desktop\Auth\compiler\codes
// will join root directory and 'codes'

// if path doesnt exists then create this
if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes,{recursive: true}); // recursive- any missing parent directories in the given path are created too.
}

// unique file - unique string needed - use uuid
const generateFile = (language , code) => {
    const jobId = uuid(); // lcad0987-615d-424f-bic6-f6988bd247d
    const fileName= `${jobId}.${language}`; // lcad0987-615d-424f-bic6-f6988bd247d.java - unique file name
    const filePath= path.join(dirCodes,fileName); // ..codes/uparwla...java
    fs.writeFileSync(filePath,code); // is file path ke andar ye code pass krdo
    return filePath;
};

module.exports = generateFile;

/**
 * Utility responsible for creating unique temporary source-code files on disk.
 *
 * Why do we need this?
 * 1. The online compiler receives raw code text from the client.
 * 2. In order to compile / execute the program we must first write that text
 *    into a real file so that tools like `g++` can read it.
 * 3. We keep things tidy by placing every generated file inside a dedicated
 *    `codes` folder (created automatically if it does not yet exist).
 * 4. A UUID (universally-unique identifier) is used to ensure file names never
 *    clash when several users hit the endpoint at the same time.
 *
 * The main export is `generateFile(extension, code)` which returns **the full
 * path** of the freshly-created file so that the caller can pass it to the
 * next build / run step.
 */



// handle error
// handle all cpp and java
// frontend also