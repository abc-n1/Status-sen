const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Initialize WhatsApp client with session persistence
const client = new Client({
  authStrategy: new LocalAuth(), // Save session to avoid re-scanning QR code
  puppeteer: { headless: true } // Run in headless mode
});

// Generate QR code for authentication
client.on('qr', (qr) => {
  console.log('QR RECEIVED, scan it with your WhatsApp app:');
  qrcode.generate(qr, { small: true });
});

// Client ready event
client.on('ready', () => {
  console.log('WhatsApp Bot is ready!');
});

// Track status updates
client.on('message', async (message) => {
  // Example: Respond to "!status" command to check recent statuses
  if (message.body === '!status') {
    try {
      const chats = await client.getChats();
      const statusUpdates = [];
      for (const chat of chats) {
        if (chat.isGroup) continue; // Skip groups
        const contact = await chat.getContact();
        const status = await contact.getStatus();
        if (status) {
          statusUpdates.push(`${contact.pushname || contact.number}: ${status}`);
        }
      }
      if (statusUpdates.length > 0) {
        message.reply(`Recent Status Updates:\n${statusUpdates.join('\n')}`);
      } else {
        message.reply('No recent status updates found.');
      }
    } catch (err) {
      console.error('Error fetching statuses:', err);
      message.reply('Error fetching status updates.');
    }
  }
});

// Handle connection errors and reconnect
client.on('disconnected', (reason) => {
  console.log('Client disconnected:', reason);
  client.initialize(); // Attempt to reconnect
});

client.initialize();
