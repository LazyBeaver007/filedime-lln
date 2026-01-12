const { spawn } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const tauriDir = path.join(root, 'src-tauri');

function run(name, command, args, opts = {}) {
  const proc = spawn(command, args, Object.assign({ cwd: opts.cwd || root, shell: true, stdio: 'inherit' }, opts));

  proc.on('exit', (code, signal) => {
    if (code !== 0) {
      console.error(`${name} exited with code ${code}${signal ? ` (signal ${signal})` : ''}`);
      // kill other processes and exit
      process.exit(code);
    } else {
      console.log(`${name} exited successfully`);
    }
  });

  proc.on('error', (err) => {
    console.error(`${name} failed:`, err);
    process.exit(1);
  });

  return proc;
}

const cargo = run('tauri:cargo', 'cargo', ['run'], { cwd: tauriDir });
const web = run('web:next', 'npm', ['run', 'dev'], { cwd: root });

function shutdown() {
  if (!cargo.killed) try { cargo.kill('SIGINT'); } catch (e) {}
  if (!web.killed) try { web.kill('SIGINT'); } catch (e) {}
  process.exit(0);
}

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down child processes...');
  shutdown();
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down child processes...');
  shutdown();
});
