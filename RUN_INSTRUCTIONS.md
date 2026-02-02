# 🚀 How to Run Your Portfolio System - Step by Step Guide

## Prerequisites Check
Before starting, ensure you have:
- ✅ Node.js (v18+) installed
- ✅ Python (v3.10+) installed
- ✅ PostgreSQL installed and running
- ✅ npm installed

---

## Step 1: Install Frontend Dependencies

Open **Terminal 1** (PowerShell) in the project root:

```powershell
cd "c:\Users\John Wayne Enrique\PersonalPorfolio"
npm install
```

Wait for installation to complete.

---

## Step 2: Setup Backend Environment

### 2.1 Navigate to Backend Directory

```powershell
cd backend
```

### 2.2 Create Python Virtual Environment (if not already created)

```powershell
python -m venv venv
```

### 2.3 Activate Virtual Environment

```powershell
.\venv\Scripts\Activate.ps1
```

**Note:** If you get an execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2.4 Install Python Dependencies

```powershell
pip install -r requirements.txt
```

### 2.5 Verify Backend .env File

Make sure `backend/.env` exists and contains:

```env
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=1
FRONTEND_ORIGIN=http://localhost:5173
PGHOST=localhost
PGPORT=5432
PGDATABASE=personal_portfolio
PGUSER=postgres
PGPASSWORD=your-postgres-password
WEB3FORMS_ACCESS_KEY=your-web3forms-access-key
ADMIN_API_KEY=Pass_123
```

**Important:** Replace `your-postgres-password` with your actual PostgreSQL password.

### 2.6 Setup Database

**Option A: Using pgAdmin4**
1. Open pgAdmin4
2. Create database named `personal_portfolio`
3. Open Query Tool
4. Execute `backend/db/create_reviews.sql`

**Option B: Using psql**
```powershell
psql -U postgres -d personal_portfolio -f db\create_reviews.sql
```

### 2.7 Run Django Migrations

```powershell
python manage.py makemigrations
python manage.py migrate
```

---

## Step 3: Verify Frontend .env File

Make sure `.env` file exists in the project root with:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WEB3FORMS_ACCESS_KEY=your-web3forms-access-key
```

---

## Step 4: Start All Servers

You need **3 separate terminal windows** running simultaneously:

### Terminal 1: Portfolio Frontend

```powershell
cd "c:\Users\John Wayne Enrique\PersonalPorfolio"
npm run dev
```

**Expected Output:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ Portfolio will open at: **http://localhost:5173**

---

### Terminal 2: Admin Panel Frontend

Open a **new PowerShell window**:

```powershell
cd "c:\Users\John Wayne Enrique\PersonalPorfolio"
npm run dev:admin
```

**Expected Output:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5174/
```

✅ Admin Panel will open at: **http://localhost:5174/admin.html**

---

### Terminal 3: Django Backend

Open a **new PowerShell window**:

```powershell
cd "c:\Users\John Wayne Enrique\PersonalPorfolio\backend"
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

**Expected Output:**
```
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
Django version 5.1.2, using settings 'server.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

✅ API will be available at: **http://localhost:8000**

---

## Step 5: Verify Everything is Running

Open your browser and check:

1. **Portfolio:** http://localhost:5173
   - Should show your portfolio website
   - Reviews section should load (if backend is running)

2. **Admin Panel:** http://localhost:5174/admin.html
   - Should show login page
   - Enter admin key: `Pass_123` (or your custom key from backend/.env)

3. **API:** http://localhost:8000/api/reviews/
   - Should return JSON data (empty array `[]` if no reviews)

---

## 🛑 Stopping the Servers

To stop any server, press `CTRL + C` in its terminal window.

**Important:** Stop all 3 servers when you're done:
- Stop Terminal 1 (Portfolio)
- Stop Terminal 2 (Admin Panel)
- Stop Terminal 3 (Backend)

---

## 🔧 Troubleshooting

### Port Already in Use

If you see "port already in use" error:

**For Frontend (5173 or 5174):**
```powershell
# Find process using the port
netstat -ano | findstr :5173
# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**For Backend (8000):**
```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Database Connection Error

1. Verify PostgreSQL is running:
   ```powershell
   # Check if PostgreSQL service is running
   Get-Service -Name postgresql*
   ```

2. Verify database exists:
   ```powershell
   psql -U postgres -l
   ```

3. Check credentials in `backend/.env`

### CORS Errors

- Verify `FRONTEND_ORIGIN=http://localhost:5173` in `backend/.env`
- Make sure backend is running before frontend

### Module Not Found Errors

**Frontend:**
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

**Backend:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Virtual Environment Not Activating

```powershell
# Try this instead
cd backend
.\venv\Scripts\python.exe manage.py runserver
```

---

## 📝 Quick Reference Commands

### Start Portfolio Only
```powershell
npm run dev
```

### Start Admin Panel Only
```powershell
npm run dev:admin
```

### Start Backend Only
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

### Build for Production
```powershell
npm run build:portfolio  # Build portfolio
npm run build:admin      # Build admin panel
```

---

## ✅ Success Checklist

- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend virtual environment created and activated
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Database created and migrations run
- [ ] `.env` files configured correctly
- [ ] Portfolio running on http://localhost:5173
- [ ] Admin panel running on http://localhost:5174/admin.html
- [ ] Backend API running on http://localhost:8000
- [ ] All 3 servers running simultaneously

---

**Need Help?** Check the main `README.md` for more detailed information.
