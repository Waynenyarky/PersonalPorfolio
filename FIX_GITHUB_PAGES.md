# 🔧 Fix GitHub Pages Deployment Error

## Error: "Resource not accessible by integration" / "Create Pages site failed"

This error occurs because GitHub Pages needs to be **manually enabled** in your repository settings before the workflow can deploy.

---

## ✅ Solution: Enable GitHub Pages Manually

### Step 1: Go to Repository Settings

1. Go to your GitHub repository: `https://github.com/yourusername/PersonalPortfolio`
2. Click on **"Settings"** tab (top menu)
3. Scroll down to **"Pages"** in the left sidebar

### Step 2: Configure GitHub Pages

1. Under **"Source"**, select:
   - **"GitHub Actions"** (not "Deploy from a branch")
   
2. **Save** the settings

### Step 3: Verify the Workflow

1. Go to **"Actions"** tab in your repository
2. You should see the workflow running or completed
3. Once it completes, your site will be available at:
   ```
   https://yourusername.github.io/PersonalPortfolio/
   ```

---

## 🔄 Alternative: If "GitHub Actions" Option is Not Available

If you don't see "GitHub Actions" as an option:

### Option A: Enable Pages with Branch Deployment (Temporary)

1. Go to **Settings → Pages**
2. Under **"Source"**, select:
   - **"Deploy from a branch"**
   - Branch: **`gh-pages`** or **`main`**
   - Folder: **`/ (root)`**
3. Click **"Save"**
4. Wait a few minutes
5. Go back and change it to **"GitHub Actions"**

### Option B: Create gh-pages Branch Manually

```powershell
# Build locally first
npm run build:portfolio

# Create and switch to gh-pages branch
git checkout --orphan gh-pages
git rm -rf .

# Copy dist files to root
cp -r dist/* .

# Commit and push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# Switch back to main
git checkout main
```

Then in Settings → Pages, select **"Deploy from a branch"** → **`gh-pages`**

---

## 🛠️ Updated Workflow File

I've already updated your workflow file to remove the `enablement: true` parameter that was causing the error. The workflow should now work once Pages is enabled.

**Current workflow location:** `.github/workflows/deploy.yml`

---

## 📋 Checklist

- [ ] GitHub Pages is enabled in Settings → Pages
- [ ] Source is set to **"GitHub Actions"**
- [ ] Workflow file is updated (already done)
- [ ] Repository is **Public** (required for free GitHub Pages)
- [ ] Workflow has run successfully

---

## 🚨 Common Issues

### Issue: "Repository is private"

**Solution:** GitHub Pages for private repositories requires GitHub Pro. Either:
- Make repository **Public** (free)
- Upgrade to **GitHub Pro** (paid)

### Issue: "Workflow still failing"

**Solution:** 
1. Check the **Actions** tab for detailed error messages
2. Make sure your repository has the workflow file: `.github/workflows/deploy.yml`
3. Verify the build succeeds: Check if `npm run build:portfolio` works locally

### Issue: "Site not accessible after deployment"

**Solution:**
1. Wait 5-10 minutes for DNS propagation
2. Check the **Actions** tab - deployment should show "green checkmark"
3. Visit: `https://yourusername.github.io/PersonalPortfolio/`
4. If using a custom domain, check DNS settings

---

## 🎯 Quick Fix Steps Summary

1. **Go to:** `https://github.com/yourusername/PersonalPortfolio/settings/pages`
2. **Select:** Source → **"GitHub Actions"**
3. **Save**
4. **Wait** for the workflow to run (check Actions tab)
5. **Visit:** `https://yourusername.github.io/PersonalPortfolio/`

---

## ✅ After Enabling Pages

Once Pages is enabled:
- The workflow will automatically deploy on every push to `main`
- Your site will be live at: `https://yourusername.github.io/PersonalPortfolio/`
- Updates will deploy automatically when you push changes

---

**Need more help?** Check the GitHub Actions logs in the **Actions** tab for specific error messages.
