ADITYA KUMAR PORTFOLIO — PROFESSIONAL UPDATE

FILES
- index.html, style.css, script.js: complete front-end
- server.js: secure server-side Groq API proxy
- package.json: dependencies and start command
- .env.example: environment-variable template

INSTALL (Windows + VS Code)
1. Backup your old project folder.
2. Extract this ZIP into a NEW folder first.
3. Copy your own profile.jpeg and Resume.pdf into this folder. Keep exact filenames.
4. Open this folder in VS Code (File > Open Folder).
5. Copy .env.example to a new file named .env.
6. Put your NEW Groq key after GROQ_API_KEY= in .env. Never paste the key in HTML/JS or upload .env.
7. Open Terminal > New Terminal. Confirm terminal path is this project folder.
8. Run: npm install
9. Run: npm start
10. Open http://localhost:3000 (not Live Server's 127.0.0.1:5500) to use AI.

ANIMATIONS
- The intro animation and profile 3D tilt work with Live Server too, provided you opened this updated index.html and style.css. Hard refresh with Ctrl+Shift+R.
- AI requires Node.js server; Live Server alone cannot provide /api/chat.

TROUBLESHOOTING
- If `npm` is not recognized, install Node.js 18 or newer and reopen VS Code.
- If port 3000 is busy, set PORT=3001 in .env, restart, and open http://localhost:3001.
- If AI says not configured, check .env filename (not .env.txt), then stop server with Ctrl+C and run npm start again.
- If Groq reports an API error, verify the key and model in .env. Never share screenshots showing the key.
- The uploaded screenshot exposed a key. Revoke that key in Groq and create a new one before testing.
