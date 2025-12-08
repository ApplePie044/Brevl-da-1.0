# Backend Installation - Postkoll E-post

## Snabbstart

### 1. Installera Node.js
Ladda ner och installera från https://nodejs.org/ (LTS-version)

### 2. Installera beroenden
Öppna PowerShell i `backend`-mappen:
```powershell
cd backend
npm install
```

### 3. Konfigurera e-post

#### Gmail (Rekommenderat):
1. Kopiera `.env.example` till `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Öppna `.env` och uppdatera:
   ```
   EMAIL_USER=din.email@gmail.com
   EMAIL_PASSWORD=ditt_app_lösenord
   ```

3. Skapa Gmail App Password:
   - Gå till https://myaccount.google.com/security
   - Aktivera "2-Step Verification"
   - Gå till "App passwords": https://myaccount.google.com/apppasswords
   - Välj "Mail" och din enhet
   - Kopiera det 16-siffriga lösenordet
   - Klistra in i `.env` som `EMAIL_PASSWORD`

#### Alternativ: Outlook/Hotmail
I `server.js`, ändra:
```javascript
service: 'outlook'
```
Och använd ditt vanliga lösenord i `.env`.

### 4. Starta servern
```powershell
npm start
```

För utveckling (auto-restart):
```powershell
npm run dev
```

Servern körs på: http://localhost:3000

### 5. Testa e-postkonfigurationen
Öppna i webbläsare: http://localhost:3000/api/test-email

Om OK får du:
```json
{"success": true, "message": "E-postkonfiguration OK"}
```

## Användning

När backend körs:
- **Inloggningskoder** skickas automatiskt till användarens e-post
- **Brevlåde-notifikationer** skickas när brevlådan öppnas/stängs
- Om backend INTE körs, går appen över till DEMO-läge (visar koder i alert)

## Felsökning

### "Backend körs inte - DEMO-läge"
- Kontrollera att servern körs (`npm start`)
- Kontrollera att URL:en är `http://localhost:3000`

### "E-postkonfiguration misslyckades"
- Dubbelkolla `.env`-filen
- För Gmail: Se till att App Password är korrekt
- Kontrollera att 2-Step Verification är aktiverat (Gmail)

### "Could not send email"
- Kontrollera internetanslutning
- Verifiera e-postadress och lösenord
- Kolla serverlogs för detaljer

## Produktion

För produktion, byt ut:
1. `http://localhost:3000` → din server-URL
2. Använd miljövariabler för känslig data
3. Lägg till HTTPS
4. Använd en dedikerad e-posttjänst (SendGrid, Mailgun, etc.)

## API Endpoints

**POST /api/send-login-code**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**POST /api/send-mailbox-notification**
```json
{
  "email": "user@example.com",
  "subject": "Brevlådan stängd",
  "message": "Brevlådan öppnades: Idag 14:30..."
}
```

**GET /api/test-email**
Testar e-postkonfigurationen.
