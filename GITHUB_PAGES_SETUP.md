# 🚀 GitHub Pages Setup - Step by Step

## ⚠️ IMPORTANT: Enable GitHub Pages First!

The workflow will fail until you enable GitHub Pages in your repository settings.

---

## ✅ Step-by-Step Setup

### Step 1: Enable GitHub Pages

1. **Go to your repository on GitHub:**
   ```
   https://github.com/yourusername/PersonalPortfolio
   ```

2. **Click "Settings"** (top menu bar)

3. **Click "Pages"** (left sidebar, under "Code and automation")

4. **Under "Source":**
   - Select: **"GitHub Actions"** (NOT "Deploy from a branch")
   - Click **"Save"**

5. **Wait 1-2 minutes** for GitHub to set up Pages

---

### Step 2: Verify Repository is Public

GitHub Pages (free tier) requires a **public repository**:

1. Go to **Settings → General**
2. Scroll to **"Danger Zone"**
3. If repository is **Private**, click **"Change visibility"** → **"Make public"**

---

### Step 3: Trigger the Workflow

**Option A: Push a new commit**
```powershell
git add .
git commit -m "Enable GitHub Pages deployment"
git push origin main
```

**Option B: Manual trigger**
1. Go to **Actions** tab
2. Click **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"** → **"Run workflow"**

---

### Step 4: Check Deployment

1. Go to **Actions** tab
2. Click on the running workflow
3. Wait for it to complete (green checkmark = success)
4. Your site will be at:
   ```
   https://yourusername.github.io/PersonalPortfolio/
   ```

---

## 🔍 Troubleshooting

### Error: "Resource not accessible by integration"

**Cause:** GitHub Pages is not enabled in repository settings.

**Fix:**
1. Go to **Settings → Pages**
2. Select **"GitHub Actions"** as source
3. Click **Save**
4. Re-run the workflow

---

### Error: "Create Pages site failed"

**Cause:** Same as above - Pages needs to be enabled first.

**Fix:** Follow Step 1 above.

---

### Error: "Repository is private"

**Cause:** Free GitHub Pages requires public repositories.

**Fix:**
1. Go to **Settings → General**
2. Scroll to **"Danger Zone"**
3. Click **"Change visibility"** → **"Make public"**

---

### Workflow Runs But Site Doesn't Load

**Possible causes:**
1. **Wait 5-10 minutes** - DNS propagation takes time
2. **Check the URL** - Make sure you're using the correct format:
   - `https://yourusername.github.io/PersonalPortfolio/`
   - Note the trailing slash and repository name
3. **Check Actions tab** - Make sure deployment succeeded (green checkmark)
4. **Clear browser cache** - Try incognito/private mode

---

## 📋 Quick Checklist

Before running the workflow:

- [ ] Repository is **Public**
- [ ] GitHub Pages is enabled in **Settings → Pages**
- [ ] Source is set to **"GitHub Actions"**
- [ ] Workflow file exists: `.github/workflows/deploy.yml`
- [ ] You've pushed the workflow file to GitHub

---

## 🎯 After Setup

Once Pages is enabled:

- ✅ Workflow will deploy automatically on every push to `main`
- ✅ Your site will be live at: `https://yourusername.github.io/PersonalPortfolio/`
- ✅ Updates deploy automatically when you push changes

---

## 🔄 Manual Deployment (Alternative)

If GitHub Actions doesn't work, you can deploy manually:

```powershell
# Build locally
npm run build:portfolio

# Create gh-pages branch
git checkout --orphan gh-pages
git rm -rf .
cp -r dist/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages --force

# Switch back
git checkout main
```

Then in **Settings → Pages**, select **"Deploy from a branch"** → **`gh-pages`**

---

## 📞 Still Having Issues?

1. **Check Actions tab** for detailed error messages
2. **Verify repository is public**
3. **Make sure Pages is enabled** in Settings
4. **Wait 5-10 minutes** after enabling Pages before running workflow

---

**Your site URL will be:**
```
https://yourusername.github.io/PersonalPortfolio/
```

Replace `yourusername` with your actual GitHub username and `PersonalPortfolio` with your repository name.
