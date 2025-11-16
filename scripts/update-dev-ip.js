const fs = require('fs');
const path = require('path');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const priorityOrder = ['en0', 'Wi-Fi', 'eth0', 'Ethernet'];
  
  for (const name of priorityOrder) {
    if (interfaces[name]) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  }
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return null;
}

const easJsonPath = path.join(__dirname, '..', 'eas.json');
const easConfig = JSON.parse(fs.readFileSync(easJsonPath, 'utf8'));

const detectedIP = getLocalIP();

if (!detectedIP) {
  console.error('❌ Failed to detect local IP address');
  process.exit(1);
}

// Update the development build profile
if (easConfig.build && easConfig.build.development && easConfig.build.development.env) {
  easConfig.build.development.env.WEB_URL = `http://${detectedIP}:5173`;
  
  fs.writeFileSync(easJsonPath, JSON.stringify(easConfig, null, 2) + '\n');
  
  console.log(`✅ Updated eas.json development profile with IP: ${detectedIP}`);
  console.log(`   WEB_URL: http://${detectedIP}:5173`);
} else {
  console.error('❌ Invalid eas.json structure');
  process.exit(1);
}
