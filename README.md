#  Tip Submission App

A two-page web application built with React and Node.js to collect, store, and display user-submitted tips. Data is stored in a JSON file hosted on GitHub, and the frontend includes client-side validation, autosave, and mobile responsiveness.

## Tech Stack

- Frontend: React, HTML5, CSS3, JavaScript
- Backend: Node.js, Express.js
- Data Storage: JSON file hosted on GitHub
- Deployment: Vercel / Netlify (Frontend), Render / Cyclic.sh / Localhost (Backend)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/tip-submission-app.git
cd tip-submission-app
```

2. Setup Backend
```bash
cd server
npm install
npm start
```

3. Setup Frontend
```bash
cd ../client
npm install
npm start
```

--> Features

Page 1: Tip Submission Form

1- Full Name (optional)

2- Email Address (optional, validated)

3- Message (required, min 50 characters)

4- Subscribe to bataSutra newsletter (optional)

5- Submission Date (auto-generated)

6- Client-side validation

7- Success message + form reset

8- Autosave form state via localStorage

9- CAPTCHA/spam prevention (basic math challenge)

Page 2: Tip Archive

1- Display of all past tips in a clean table/card layout

2- Shows message, date, and optional name/email

3- Mobile responsive design

-->Security

1- Input sanitization to prevent XSS/script injection
2- Simple CAPTCHA-based spam prevention

--> Hosting Options

1- Frontend: Vercel, Netlify, or GitHub Pages

2- Backend: Render, Cyclic, or local Node server

3- Data JSON: GitHub raw link (e.g., https://raw.githubusercontent.com/username/repo/main/data.json)

--> Dependencies
1- Frontend
- React
-React Router 
- CSS Modules / Styled Components

-->Backend
-Express
-Body-parser
-CORS

--> API Endpoints
```bash
POST /api/tips        # Submit a new tip
GET  /api/tips        # Get all tips
```
