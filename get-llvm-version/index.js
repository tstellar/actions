const core = require('@actions/core');
const { execSync } = require('child_process');
const srcdir = core.getInput('srcdir');
//const cmd = "grep -o 'LLVM_VERSION_\\(MAJOR\\|MINOR\\|PATCH\\) [0-9]\\+' " + srcdir + "/llvm/CMakeLists.txt"
const cmd = "grep -o 'LLVM_VERSION_' " + srcdir + "/llvm/CMakeLists.txt"

console.log(cmd);
execSync(cmd, (error, stdout, stderr) => {
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  stdout.split("\n").forEach(function(line) {
    console.log(line);
    data = line.split(" ");
    console.log(data[0])
		  console.log(data[1])
    core.setOutput(data[0], data[1]);
  });
});
