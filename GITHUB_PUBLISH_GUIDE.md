# 🚀 How to Publish Your Portfolio to GitHub

Complete step-by-step guide to publish your portfolio project to GitHub.

---

## 📋 Prerequisites

- Git installed on your computer
- GitHub account (create one at [github.com](https://github.com) if you don't have one)
- Your project ready to publish

---

## Step 1: Check if Git is Installed

Open PowerShell and run:

```powershell
git --version
```

If Git is not installed, download it from [git-scm.com](https://git-scm.com/download/win)

---

## Step 2: Initialize Git Repository (if not already done)

Navigate to your project directory:

```powershell
cd "c:\Users\John Wayne Enrique\PersonalPorfolio"
```

Check if Git is already initialized:

```powershell
git status
```

If you see "not a git repository", initialize it:

```powershell
git init
```

---

## Step 3: Create/Update .gitignore File

Make sure your `.gitignore` file exists and includes these important entries:

```gitignore
# Dependencies
node_modules/
venv/
backend/venv/
__pycache__/
*.pyc

# Environment variables (IMPORTANT - never commit these!)
.env
backend/.env
.env.local
.env.*.local

# Build outputs
dist/
dist-admin/
build/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Django
*.db
*.sqlite3
db.sqlite3

# Python
*.py[cod]
*$py.class
*.so
.Python

# Vite
.vite/
```

**⚠️ CRITICAL:** Never commit `.env` files! They contain sensitive information like API keys and passwords.

---

## Step 4: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name:** `PersonalPortfolio` (or your preferred name)
   - **Description:** "Personal portfolio website with reviews and booking system"
   - **Visibility:** Choose **Public** (for GitHub Pages) or **Private**
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

---

## Step 5: Add All Files to Git

**First, check what files will be added:**

```powershell
git status
```

**Add all files (except those in .gitignore):**

```powershell
git add .
```

**Verify what's being added:**

```powershell
git status
```

You should see your files listed. Make sure `.env` files are NOT listed!

---

## Step 6: Create Initial Commit

```powershell
git commit -m "Initial commit: Personal portfolio website"
```

---

## Step 7: Connect to GitHub Repository

**Copy your repository URL from GitHub** (it will look like: `https://github.com/yourusername/PersonalPortfolio.git`)

**Add the remote repository:**

```powershell
git remote add origin https://github.com/yourusername/PersonalPortfolio.git
```

Replace `yourusername` with your actual GitHub username.

**Verify the remote was added:**

```powershell
git remote -v
```

---

## Step 8: Push to GitHub

**Push your code to GitHub:**

```powershell
git branch -M main
git push -u origin main
```

You'll be prompted for your GitHub username and password (or personal access token).

**Note:** If you have 2FA enabled, you'll need a **Personal Access Token** instead of your password.

---

## Step 9: Create Personal Access Token (if needed)

If you're asked for a token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token (classic)"**
3. Give it a name: "Portfolio Project"
4. Select scopes: **repo** (full control)
5. Click **"Generate token"**
6. **Copy the token immediately** (you won't see it again!)
7. Use this token as your password when pushing

---

## Step 10: Verify Upload

1. Go to your GitHub repository page
2. You should see all your files there
3. Check that `.env` files are **NOT** visible (they should be ignored)

---

## 🌐 Optional: Set Up GitHub Pages (Host Your Site)

### Option A: Deploy Frontend Only

1. **Build your portfolio:**

```powershell
npm run build:portfolio
```

2. **Go to your GitHub repository → Settings → Pages**

3. **Configure:**
   - Source: **Deploy from a branch**
   - Branch: **main** (or **gh-pages**)
   - Folder: **/ (root)** or **/dist**

4. **Push the dist folder:**

```powershell
# Create a separate branch for GitHub Pages
git checkout -b gh-pages
git add dist/
git commit -m "Deploy portfolio to GitHub Pages"
git push origin gh-pages
```

5. **Your site will be available at:**
   ```
   https://yourusername.github.io/PersonalPortfolio/
   ```

### Option B: Use GitHub Actions for Auto-Deploy

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Portfolio

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build portfolio
        run: npm run build:portfolio
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 📝 Important Notes

### 1. Environment Variables

**Never commit `.env` files!** Instead:

1. Create a `.env.example` file with placeholder values:

```env
# Frontend .env.example
VITE_API_BASE_URL=http://localhost:8000
VITE_EMAILJS_SERVICE_ID=your-service-id
VITE_EMAILJS_TEMPLATE_ID=your-template-id
VITE_EMAILJS_USER_ID=your-user-id
VITE_CONTACT_EMAIL=your-email@example.com
VITE_WEB3FORMS_ACCESS_KEY=your-web3forms-key
```

2. Commit `.env.example` instead
3. Document in README that users need to copy `.env.example` to `.env` and fill in values

### 2. Backend Deployment

GitHub Pages only hosts static files. For your Django backend:

- **Option 1:** Deploy backend separately (Heroku, Railway, Render, etc.)
- **Option 2:** Use serverless functions (Vercel, Netlify Functions)
- **Option 3:** Keep backend local for development only

### 3. Update README.md

Make sure your README includes:
- Project description
- Setup instructions
- How to get environment variables
- Deployment instructions

---

## 🔄 Future Updates

When you make changes:

```powershell
# Check what changed
git status

# Add changes
git add .

# Commit with descriptive message
git commit -m "Add new feature: contact form improvements"

# Push to GitHub
git push origin main
```

---

## 🐛 Troubleshooting

### Issue: "remote origin already exists"

```powershell
git remote remove origin
git remote add origin https://github.com/yourusername/PersonalPortfolio.git
```

### Issue: "failed to push some refs"

```powershell
git pull origin main --rebase
git push origin main
```

### Issue: ".env file was committed"

```powershell
# Remove from Git (but keep local file)
git rm --cached .env
git rm --cached backend/.env

# Commit the removal
git commit -m "Remove .env files from repository"

# Push
git push origin main
```

### Issue: "Authentication failed"

- Use Personal Access Token instead of password
- Make sure token has `repo` scope

---

## ✅ Checklist Before Publishing

- [ ] `.gitignore` includes `.env` files
- [ ] `.env` files are NOT in the repository
- [ ] All sensitive data removed from code
- [ ] README.md is updated
- [ ] Project builds successfully (`npm run build`)
- [ ] No API keys or passwords in code
- [ ] Repository is set to Public (if using GitHub Pages) or Private

---

## 🎉 You're Done!

Your portfolio is now on GitHub! Share the repository link with others:

```
https://github.com/yourusername/PersonalPortfolio
```

---

## 📚 Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

---

**Need Help?** Check the troubleshooting section or refer to GitHub's official documentation.
