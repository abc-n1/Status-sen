const { Client, LocalAuth } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const config = require('./config');

// Initialize WhatsApp client
const client = new Client({
  auth: new LocalAuth({ id: config.SESSION_ID }),
});

// Handle QR code for authentication
client.on('qr', (qr) => {
  console.log('Scan the QR code below to login:');
  qrcode.generate(qr, { small: true });
});

// Handle connection
client.on('ready', () => {
  console.log('Bot is connected and ready!');
});

// Handle status updates
client.on('messages.upsert', async ({ messages }) => {
  for (const message of messages) {
    if (message.key && message.key.remoteJid?.endsWith('@status')) {
      try {
        // Mark status as viewed
        await client.readMessages([message.key]);
        console.log(`Viewed status from ${message.key.remoteJid}`);
      } catch (error) {
        console.error('Error viewing status:', error.message);
      }
    }
  }
});

// Handle basic commands (optional)
client.on('message', async (message) => {
  if (!message.body?.startsWith(config.PREFIX)) return;

  const command = message.body.slice(config.PREFIX.length).trim().toLowerCase();
  if (command === 'ping') {
    await client.sendMessage(message.from, 'Pong!');
  }
});

// Handle errors
client.on('error', (error) => {
  console.error('Bot error:', error.message);
});

// Connect the bot
client.connect()
  .then(() => console.log('Connecting to WhatsApp...'))
  .catch((error) => {
    console.error('Connection failed:', error.message);
    process.exit(1);
  });
