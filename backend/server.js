const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const ACCOUNTS_FILE = path.join(__dirname, 'accounts.json');

// Middleware
app.use(cors());
app.use(express.json());

// Läs konton från fil
function loadAccounts() {
  try {
    if (fs.existsSync(ACCOUNTS_FILE)) {
      const data = fs.readFileSync(ACCOUNTS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Fel vid läsning av konton:', error);
    return [];
  }
}

// Spara konton till fil
function saveAccounts(accounts) {
  try {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
  } catch (error) {
    console.error('Fel vid sparande av konton:', error);
  }
}

// Endpoint för att registrera nytt konto
app.post('/api/register', (req, res) => {
  const { email, username } = req.body;

  if (!email || !username) {
    return res.status(400).json({ error: 'E-post och namn krävs' });
  }

  const accounts = loadAccounts();
  
  // Kontrollera om e-post redan finns (exklusive dev-konton)
  if (accounts.some(acc => acc.email === email && !acc.isDev)) {
    return res.status(400).json({ error: 'E-postadressen är redan registrerad' });
  }

  // Lägg till nytt konto
  const newAccount = {
    id: Date.now().toString(),
    email,
    username,
    isDev: false,
    createdAt: new Date().toISOString()
  };

  accounts.push(newAccount);
  saveAccounts(accounts);

  res.json({ success: true, message: 'Konto skapat', account: newAccount });
});

// Endpoint för att validera e-postadress vid inloggning
app.post('/api/validate-email', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'E-post krävs' });
  }

  const accounts = loadAccounts();
  const account = accounts.find(acc => acc.email === email);

  if (!account) {
    return res.status(404).json({ error: 'Inget konto hittat med denna e-postadress' });
  }

  res.json({ success: true, account });
});

// Endpoint för att hämta alla konton (admin)
app.get('/api/admin/accounts', (req, res) => {
  const accounts = loadAccounts();
  res.json({ accounts, total: accounts.length });
});

// Skapa e-posttransport
const transporter = nodemailer.createTransport({
  service: 'gmail', // eller annan tjänst: 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Endpoint för att skicka inloggningskod
app.post('/api/send-login-code', async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'E-post och kod krävs' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Din inloggningskod - Postkoll',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0b5cff;">Postkoll - Inloggningskod</h2>
        <p>Din inloggningskod är:</p>
        <div style="background: #f5f8ff; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h1 style="color: #07326a; font-size: 36px; margin: 0; letter-spacing: 8px;">${code}</h1>
        </div>
        <p style="color: #666;">Koden är giltig i 10 minuter.</p>
        <p style="color: #666; font-size: 12px;">Om du inte begärde denna kod, ignorera detta e-postmeddelande.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'E-post skickad' });
  } catch (error) {
    console.error('E-postfel:', error);
    res.status(500).json({ error: 'Kunde inte skicka e-post', details: error.message });
  }
});

// Endpoint för brevlåde-notifikationer
app.post('/api/send-mailbox-notification', async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ error: 'E-post, ämne och meddelande krävs' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0b5cff;">Postkoll - Brevlådenotifikation</h2>
        <div style="background: #f5f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <pre style="font-family: Arial, sans-serif; white-space: pre-wrap; margin: 0;">${message}</pre>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'E-post skickad' });
  } catch (error) {
    console.error('E-postfel:', error);
    res.status(500).json({ error: 'Kunde inte skicka e-post', details: error.message });
  }
});

// Testa e-postkonfigurationen
app.get('/api/test-email', async (req, res) => {
  try {
    await transporter.verify();
    res.json({ success: true, message: 'E-postkonfiguration OK' });
  } catch (error) {
    res.status(500).json({ error: 'E-postkonfiguration misslyckades', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server körs på http://localhost:${PORT}`);
  console.log(`📧 E-posttjänst: ${process.env.EMAIL_USER || 'Ej konfigurerad'}`);
});
