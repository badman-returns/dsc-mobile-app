const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  // Priority order: Wi-Fi, Ethernet, then others
  const priorityOrder = ['en0', 'Wi-Fi', 'eth0', 'Ethernet'];
  
  // First, try priority interfaces
  for (const name of priorityOrder) {
    if (interfaces[name]) {
      for (const iface of interfaces[name]) {
        // Skip internal (localhost) and non-IPv4 addresses
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  }
  
  // If no priority interface found, scan all interfaces
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (localhost) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return null;
}

const ip = getLocalIP();
if (ip) {
  console.log(ip);
} else {
  console.error('Could not detect local IP address', { level: 'error' });
  process.exit(1);
}
