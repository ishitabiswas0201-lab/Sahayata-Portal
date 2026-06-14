# National Distress Response Portal (MVP)

A real, working web app for submitting and tracking distress / harassment
complaints, backed by Firebase Firestore. Citizens can submit complaints,
track status by Case ID, and an admin dashboard can view and update case
statuses.

---

## 1. Project Structure

```
ndrp/
├── index.html          # Home page
├── report.html         # Citizen complaint form
├── track.html          # Track case status by Case ID
├── admin.html          # Admin dashboard (list + update status)
├── firestore.rules     # Suggested Firestore security rules
├── css/
│   └── style.css       # Shared styling (government-style theme)
└── js/
    ├── firebase-config.js  # Firebase initialization (ADD YOUR KEYS HERE)
    ├── report.js            # Handles complaint submission
    ├── track.js              # Handles case status lookup
    └── admin.js               # Handles admin dashboard list + updates
```

---

## 2. Firebase Setup Steps

### Step 1 — Create a Firebase project
1. Go to https://console.firebase.google.com/
2. Click **Add project**, give it a name (e.g. `distress-response-portal`), and
   follow the prompts (Google Analytics is optional, you can disable it).

### Step 2 — Register a Web App
1. In your new project, click the **Web icon (`</>`)** on the project overview
   page to add a web app.
2. Give it a nickname (e.g. "NDRP Web").
3. Firebase will show you a config object like this:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "distress-response-portal.firebaseapp.com",
  projectId: "distress-response-portal",
  storageBucket: "distress-response-portal.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
```

4. Copy this object.

### Step 3 — Add config to this project
1. Open `js/firebase-config.js`
2. Replace the placeholder `firebaseConfig` object with the one you copied
   from the Firebase console.

### Step 4 — Create the Firestore Database
1. In the Firebase Console, go to **Build > Firestore Database**.
2. Click **Create database**.
3. Choose **Start in test mode** for local development/demo
   (you can apply the provided `firestore.rules` later).
4. Pick a location close to your users and click **Enable**.

### Step 5 — (Recommended) Apply security rules
1. Go to **Firestore Database > Rules**.
2. Replace the default rules with the contents of `firestore.rules` in this
   project.
3. Click **Publish**.

> These rules allow open create/read/list/update on the `cases` collection so
> the prototype works without authentication. Before any real deployment,
> tighten these rules — see the comments inside `firestore.rules`.

### Step 6 — Firestore data model
No manual setup needed — the app creates documents automatically. Each
complaint creates one document in a collection called **`cases`**, with the
**document ID set to the generated Case ID** (e.g. `NDRP-2026-483920`), and
these fields:

| Field         | Type      | Example                          |
|---------------|-----------|-----------------------------------|
| caseId        | string    | "NDRP-2026-483920"                |
| name          | string    | "Asha Verma"                      |
| phone         | string/null | "9876543210" or null            |
| type          | string    | "workplace issue"                 |
| description   | string    | "..."                              |
| severity      | string    | "low" / "medium" / "high"         |
| status        | string    | "received" / "under review" / "resolved" |
| timestamp     | timestamp | server-generated                  |

---

## 3. How to Run Locally

This app is pure HTML/CSS/JS with Firebase loaded via CDN — no build step or
`npm install` is required. However, because it uses `fetch`-like Firestore SDK
calls, you should serve it over `http://` (not `file://`) to avoid browser
CORS/module issues.

### Option A — Python's built-in server
```bash
cd ndrp
python3 -m http.server 8000
```
Then open: `http://localhost:8000/index.html`

### Option B — Node's `http-server`
```bash
npm install -g http-server
cd ndrp
http-server -p 8000
```
Then open: `http://localhost:8000/index.html`

### Option C — VS Code "Live Server" extension
Open the `ndrp` folder in VS Code, right-click `index.html`, and choose
**"Open with Live Server"**.

---

## 4. Using the App

1. **Home (`index.html`)** — entry point with links to Report and Track pages.
2. **Report Complaint (`report.html`)** —
   - Fill in Name, optional Phone, Type of Issue, Description, and Severity.
   - Click **Submit Complaint**.
   - A new document is written to the `cases` collection in Firestore, a
     unique Case ID (e.g. `NDRP-2026-483920`) is generated, and shown to the
     user with a success message.
3. **Track Case (`track.html`)** —
   - Enter the Case ID and click **Check Status**.
   - The app fetches the document from Firestore and shows a status timeline:
     `received → under review → resolved`.
4. **Admin Dashboard (`admin.html`)** —
   - Lists all submitted cases (most recent first) with Case ID, Name, Type,
     Severity, and Status.
   - HIGH severity cases are highlighted in red with an
     **"URGENT REVIEW REQUIRED"** tag (UI indicator only — no automatic
     police contact is triggered).
   - Admin can change a case's status via the dropdown
     (`received → under review → resolved`); this updates Firestore
     immediately and the citizen will see the new status on the Track page.

---

## 5. Deployment

### Option A — Firebase Hosting (recommended, same project as Firestore)
```bash
npm install -g firebase-tools
firebase login
cd ndrp
firebase init hosting
# - Select your existing Firebase project
# - Set public directory to "." (current folder)
# - Configure as single-page app: No
# - Do not overwrite index.html

firebase deploy
```

### Option B — Any static host
Since this is plain HTML/CSS/JS, you can also deploy the `ndrp` folder as-is
to Netlify, Vercel, GitHub Pages, or any static file host. Firestore will
still work since the Firebase SDK calls go directly to Google's servers from
the browser.

---

## 6. Notes & Limitations (MVP)

- No authentication: the Admin Dashboard is open to anyone with the URL.
  Add Firebase Authentication before real-world use.
- The "URGENT REVIEW REQUIRED" tag for HIGH severity cases is a **UI-only
  indicator** — it does **not** trigger any automatic emergency or police
  contact, per the requirements.
- Phone number is optional and stored as plain text; consider encryption or
  restricted access fields for sensitive data in production.
- Case IDs are generated client-side with a random 6-digit suffix; collisions
  are extremely unlikely but not impossible — for production, consider a
  Cloud Function that generates IDs server-side with a uniqueness check.
