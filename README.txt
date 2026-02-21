# Servicii funerare Daniel & Marius — ULTRA PREMIUM

## Rulare în VS Code (recomandat)
1. Instalează extensia **Live Server** (Ritwick Dey)
2. Deschide folderul în VS Code
3. Click dreapta pe `index.html` → **Open With Live Server**

## Personalizare rapidă
- Telefoane / adresă: în `index.html`
- Harta: în `index.html` (iframe google maps)
- Video hero: înlocuiește sursa din tag-ul <video> cu un fișier local `assets/hero.mp4`

Adresă setată: Strada București nr. 86, Călărași, România


## Formular contact (FULL PREMIUM) — trimitere email REAL (fără backend)
Site-ul include formular de contact cu trimitere prin **EmailJS** (merge pe orice hosting, inclusiv Plesk).

### Pași (10 minute)
1) Creează cont pe EmailJS și adaugă un Email Service (ex: Gmail / Outlook / SMTP).
2) Creează un **Email Template**.
3) Copiază cele 3 valori:
   - **Public Key**
   - **Service ID**
   - **Template ID**

### Unde le pui
Deschide `app.js` și setează:

- EMAILJS_PUBLIC_KEY = '...'
- EMAILJS_SERVICE_ID = '...'
- EMAILJS_TEMPLATE_ID = '...'

(în fișier sunt acum valori placeholder care încep cu `YOUR_...`)

### Variabile recomandate în template (EmailJS)
Folosește în template variabilele:
- {{from_name}}
- {{phone}}
- {{reply_to}}
- {{subject}}
- {{message}}
- {{city}}
- {{address}}

### Dacă nu configurezi EmailJS
Formularul deschide automat clientul de email (mailto) ca fallback.
