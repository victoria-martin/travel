const { execFile } = require('child_process');
const path = require('path');

const REPO = path.join(__dirname, '..', '..');

const shellQuote = (value) => `'${value.replace(/'/g, `'\\''`)}'`;
const appleQuote = (value) => `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

// Marks a session as born on the board, in the /resume picker and the terminal title.
const MARKER = '◉';

function claudeCommand({ sessionId, resumed, prompt, title }) {
  const flag = resumed ? `--resume ${sessionId}` : `--session-id ${sessionId}`;
  const name = title ? ` --name ${shellQuote(`${MARKER} ${title}`)}` : '';
  const opening = prompt ? ` ${shellQuote(prompt)}` : '';
  return `cd ${shellQuote(REPO)} && claude ${flag}${name}${opening}`;
}

function openInITerm(command) {
  // TEMP: ne lance pas de terminal Claude, on se contente de logger la commande.
  console.log(command);
  return Promise.resolve();
  // eslint-disable-next-line no-unreachable
  const script = `
    tell application "iTerm"
      activate
      create window with default profile
      tell current session of current window to write text ${appleQuote(command)}
    end tell
  `;
  return new Promise((resolve, reject) => {
    execFile('osascript', ['-e', script], (error, _stdout, stderr) => {
      if (error) reject(new Error(stderr || error.message));
      else resolve();
    });
  });
}

module.exports = { claudeCommand, openInITerm };
