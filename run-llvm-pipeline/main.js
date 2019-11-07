const { exec } = require('child_process');
const { spawn, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const process = require('process');

function run_command(cmd) {
  var p;
  console.log(`${cmd}`)
  exec(cmd, (error, stdout, stderr) => {
    console.log(`${stdout}`);
    console.error(`${stderr}`);
    if (error) {
      process.exit(error.code);
    }
  });
  return null;
}

function run_command_async(cmd) {
  p = spawn(cmd, { shell : true});

  p.stdout.on('data', (data) => {
    process.stdout.write(data.toString());
  });

  p.stderr.on('data', (data) => {
    process.stderr.write(data.toString());
  });

  p.on('error', (code) => {
    process.exit(code);
  });

  return p
}

function get_action_cmd(action) {
  return 'node ' + path.join(__dirname, '..', action, 'main.js');
}

if (process.argv.length != 2) {
  console.error("usage: process.argv[0] process.argv[1]");
  process.exit(1);
}

var os = process.env.INPUT_OS.toLowerCase();

user_cmake_args = process.env.INPUT_CMAKE_ARGS;
process.env.INPUT_CMAKE_ARGS = "-G Ninja ";
if (user_cmake_args) {
  process.env.INPUT_CMAKE_ARGS += user_cmake_args;
}

fs.mkdirSync('build', { recursive : true });
process.chdir(path.join(process.cwd(), 'build'));


run_command(get_action_cmd('install-ninja'));
if (os == 'windows') {
  run_command(get_action_cmd('setup-windows'));
}

p = run_command_async(get_action_cmd('configure-llvm-project'));
p.on('exit', (code, signal) => {
  if (code) {
    process.exit(code);
  }
  if (signal) {
    console.error(`Process exited: ${signal}`);
    process.exit(1);
  }
  p = run_command_async('ninja check-all');
  p.on('error', (code, signal) => {
    if (signal) {
      console.error(`Process exited: ${signal}`);
    }
    process.exit(code);
  });
});
