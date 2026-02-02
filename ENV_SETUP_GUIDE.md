# 📁 .env Files Setup Guide

You need **TWO separate `.env` files** - one for the frontend and one for the backend.

## 📍 File Locations

```
PersonalPorfolio/
├── .env                    ← FRONTEND .env (Project Root)
├── backend/
│   ├── .env               ← BACKEND .env (Backend Folder)
│   ├── manage.py
│   └── ...
└── ...
```

---

## 1️⃣ Frontend `.env` File (Project Root)

**Location:** `c:\Users\John Wayne Enrique\PersonalPorfolio\.env`

**Contents:**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Web3Forms (Optional - for reviews fallback)
VITE_WEB3FORMS_ACCESS_KEY=your-web3forms-access-key

# EmailJS Configuration (Optional - for contact form)
VITE_EMAILJS_SERVICE_ID=service_m7ykss8
VITE_EMAILJS_TEMPLATE_ID=template_fshd90d
VITE_EMAILJS_USER_ID=v1xoUuWEvGXh6S5GO
VITE_CONTACT_EMAIL=joma.enrique.up@phinmaed.com
```

**Used by:** Vite (React frontend)
**Required:** `VITE_API_BASE_URL` (others are optional)

---

## 2️⃣ Backend `.env` File (Backend Folder)

**Location:** `c:\Users\John Wayne Enrique\PersonalPorfolio\backend\.env`

**Contents:**
```env
# Django Configuration
DJANGO_SECRET_KEY=your-secret-key-here-make-it-long-and-random
DJANGO_DEBUG=1
DJANGO_ALLOWED_HOSTS=*

# CORS Configuration
FRONTEND_ORIGIN=http://localhost:5173
CORS_ALLOW_ALL=1

# PostgreSQL Database Configuration
PGHOST=localhost
PGPORT=5432
PGDATABASE=personal_portfolio
PGUSER=postgres
PGPASSWORD=your-postgres-password

# Email Service (Web3Forms)
WEB3FORMS_ACCESS_KEY=your-web3forms-access-key

# Admin Panel Authentication
ADMIN_API_KEY=Pass_123
```

**Used by:** Django (Python backend)
**Required:** All variables (especially database credentials)

---

## 🛠️ How to Create the Files

### Option 1: Using PowerShell

**Create Frontend .env:**
```powershell
cd "c:\Users\John Wayne Enrique\PersonalPorfolio"
New-Item -Path .env -ItemType File -Force
```

**Create Backend .env:**
```powershell
cd "c:\Users\John Wayne Enrique\PersonalPorfolio\backend"
New-Item -Path .env -ItemType File -Force
```

### Option 2: Using File Explorer

1. **Frontend .env:**
   - Navigate to: `c:\Users\John Wayne Enrique\PersonalPorfolio\`
   - Right-click → New → Text Document
   - Rename it to `.env` (make sure to remove `.txt` extension)
   - Windows may warn you - click "Yes"

2. **Backend .env:**
   - Navigate to: `c:\Users\John Wayne Enrique\PersonalPorfolio\backend\`
   - Right-click → New → Text Document
   - Rename it to `.env`

### Option 3: Using VS Code / Cursor

1. **Frontend .env:**
   - In your editor, right-click on the project root folder
   - Select "New File"
   - Name it `.env`

2. **Backend .env:**
   - Right-click on the `backend` folder
   - Select "New File"
   - Name it `.env`

---

## ✅ Verification

After creating the files, verify they exist:

```powershell
# Check frontend .env
Test-Path "c:\Users\John Wayne Enrique\PersonalPorfolio\.env"

# Check backend .env
Test-Path "c:\Users\John Wayne Enrique\PersonalPorfolio\backend\.env"
```

Both should return `True`.

---

## 🔒 Security Note

**IMPORTANT:** Never commit `.env` files to Git!

Make sure your `.gitignore` includes:
```
.env
.env.local
.env.*.local
backend/.env
```

---

## 📝 Quick Reference

| File | Location | Purpose | Required Variables |
|------|----------|---------|-------------------|
| `.env` | Project Root | Frontend (Vite) | `VITE_API_BASE_URL` |
| `backend/.env` | Backend Folder | Backend (Django) | All variables (DB, Django, etc.) |

---

## 🚨 Common Issues

### Issue: "Cannot find .env file"
- **Solution:** Make sure the file is named exactly `.env` (not `.env.txt` or `env`)
- In Windows, you may need to enable "Show file extensions" to rename properly

### Issue: "Environment variables not loading"
- **Frontend:** Restart the Vite dev server after creating/updating `.env`
- **Backend:** Restart the Django server after creating/updating `backend/.env`

### Issue: "File name is invalid"
- Windows doesn't allow certain characters in filenames
- Make sure you're using `.env` (with the dot at the start)
- You may need to create it via command line or your code editor

---

## 🎯 Next Steps

1. Create both `.env` files in their respective locations
2. Copy the template contents above into each file
3. Replace placeholder values with your actual credentials
4. Restart your development servers
5. Verify everything works!
