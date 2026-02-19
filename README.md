# Personal Portfolio - John Wayne Enrique

A modern, full-stack portfolio website with client reviews, booking system, and admin panel. Built with React, TypeScript, Vite, Django, and PostgreSQL.

## 🚀 Features

- **Portfolio Website**: Showcase projects, skills, and services
- **Client Reviews System**: Allow clients to submit reviews with ratings
- **Booking System**: Clients can book consultation appointments
- **Admin Panel**: Manage reviews and appointments (separate frontend)
- **Real-time Updates**: BroadcastChannel API for instant updates across tabs
- **Multi-language Support**: English and Filipino
- **Dark/Light Theme**: Theme toggle with persistence
- **Email Notifications**: Automatic email alerts for new reviews and bookings

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **Python** (v3.10 or higher)
- **PostgreSQL** (v12 or higher)
- **pgAdmin4** (optional, for database management)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd PersonalPorfolio
```

**Note:** The repository may be named `PersonalPorfolio` (with one "r" in Portfolio). You can rename it to `PersonalPortfolio` on GitHub if you prefer; update any links (e.g. resume, LinkedIn) after renaming.

### 2. Frontend Setup

#### Install Dependencies

```bash
npm install
# or
pnpm install
```

#### Create Environment File

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WEB3FORMS_ACCESS_KEY=your-web3forms-access-key
VITE_EMAILJS_SERVICE_ID=your-emailjs-service-id
VITE_EMAILJS_TEMPLATE_ID=your-emailjs-template-id
VITE_EMAILJS_USER_ID=your-emailjs-user-id
VITE_CONTACT_EMAIL=your-contact-email@example.com
```

**Note:** 
- `VITE_WEB3FORMS_ACCESS_KEY` is optional but recommended. If provided, reviews can still be sent via email even when the backend server is down.
- `VITE_EMAILJS_*` variables are optional. If not provided, the service will use default values. Get these from your [EmailJS Dashboard](https://dashboard.emailjs.com/).
- `VITE_CONTACT_EMAIL` is the email address where contact form messages will be sent.

#### Start Development Servers

**Portfolio (Main Website):**
```bash
npm run dev
# or
npm run dev:portfolio
```
Opens at `http://localhost:5173`

**Admin Panel:**
```bash
npm run dev:admin
```
Opens at `http://localhost:5174/admin.html`

### 3. Backend Setup

#### Navigate to Backend Directory

```bash
cd backend
```

#### Create Virtual Environment (Recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

#### Install Python Dependencies

```bash
pip install -r requirements.txt
```

#### Create Environment File

Create a `.env` file in the `backend/` directory:

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
ADMIN_API_KEY=your-admin-api-key
```

**⚠️ Production security:** Change `ADMIN_API_KEY` and `DJANGO_SECRET_KEY` in production; never use default or example keys.

**Environment Variables Explanation:**
- `DJANGO_SECRET_KEY`: Django secret key (generate a secure random string)
- `DJANGO_DEBUG`: Set to `1` for development, `0` for production
- `FRONTEND_ORIGIN`: Frontend URL (for CORS)
- `PGHOST`: PostgreSQL host
- `PGPORT`: PostgreSQL port (default: 5432)
- `PGDATABASE`: Database name
- `PGUSER`: PostgreSQL username
- `PGPASSWORD`: PostgreSQL password
- `WEB3FORMS_ACCESS_KEY`: Access key from Web3Forms.com for email notifications
- `ADMIN_API_KEY`: Admin authentication key (use in admin panel)

#### Database Setup

1. **Create PostgreSQL Database**

   Using pgAdmin4:
   - Open pgAdmin4
   - Right-click on "Databases" → Create → Database
   - Name: `personal_portfolio`
   - Click Save

   Or using psql:
   ```sql
   CREATE DATABASE personal_portfolio;
   ```

2. **Run Database Schema**

   Using pgAdmin4:
   - Open Query Tool
   - Open `backend/db/create_reviews.sql`
   - Execute the script (F5)

   Or using psql:
   ```bash
   psql -U postgres -d personal_portfolio -f backend/db/create_reviews.sql
   ```

3. **Run Django Migrations**

   ```bash
   cd backend
   python manage.py makemigrations
   python manage.py migrate
   ```

#### Start Django Server

```bash
cd backend
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## 🚀 Quick Start Commands

### Starting Both Frontend and Backend

You'll need **3 terminal windows** to run everything:

#### Terminal 1: Portfolio Frontend
```bash
npm run dev
# or
npm run dev:portfolio
```
➜ Portfolio: `http://localhost:5173`

#### Terminal 2: Admin Panel Frontend
```bash
npm run dev:admin
```
➜ Admin Panel: `http://localhost:5174/admin.html`

#### Terminal 3: Django Backend
```bash
cd backend
python manage.py runserver
```
➜ API: `http://localhost:8000`

### Starting Everything (Alternative: Using Multiple Terminals)

**Windows PowerShell:**
```powershell
# Terminal 1 - Portfolio
npm run dev

# Terminal 2 - Admin Panel  
npm run dev:admin

# Terminal 3 - Backend
cd backend; python manage.py runserver
```

**Linux/Mac:**
```bash
# Terminal 1 - Portfolio
npm run dev

# Terminal 2 - Admin Panel
npm run dev:admin

# Terminal 3 - Backend
cd backend && python manage.py runserver
```

### Verification

Once all servers are running, verify:
- ✅ Portfolio: http://localhost:5173
- ✅ Admin Panel: http://localhost:5174/admin.html
- ✅ API: http://localhost:8000/api/reviews/

## 📜 Available Commands

### Frontend Commands

```bash
# Development
npm run dev              # Start portfolio dev server (port 5173)
npm run dev:portfolio    # Start portfolio dev server (port 5173)
npm run dev:admin        # Start admin panel dev server (port 5174)

# Build
npm run build            # Build portfolio for production
npm run build:portfolio  # Build portfolio for production
npm run build:admin      # Build admin panel for production

# Preview
npm run preview          # Preview production build
npm run preview:portfolio # Preview portfolio production build
npm run preview:admin    # Preview admin panel production build

# Linting
npm run lint             # Run ESLint

# Tests
npm run test             # Run Vitest tests
npm run test:watch       # Run Vitest in watch mode
```

### Backend Commands

```bash
# Navigate to backend directory first
cd backend

# Database
python manage.py makemigrations  # Create migration files
python manage.py migrate          # Apply migrations
python manage.py migrate --plan   # Show migration plan

# Server
python manage.py runserver        # Start development server (port 8000)
python manage.py runserver 8001   # Start on custom port

# Django Shell
python manage.py shell            # Open Django shell
python manage.py createsuperuser # Create admin superuser

# Other
python manage.py collectstatic    # Collect static files (production)
python manage.py check            # Check for common problems
```

## 🗂️ Project Structure

```
PersonalPorfolio/
├── backend/                 # Django backend
│   ├── db/                  # Database SQL scripts
│   ├── reviews/             # Reviews and bookings app
│   │   ├── models.py        # Database models
│   │   ├── views.py         # API views
│   │   ├── serializers.py  # DRF serializers
│   │   └── urls.py          # URL routing
│   ├── server/              # Django project settings
│   ├── manage.py            # Django management script
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Backend environment variables
├── src/
│   ├── components/          # React components
│   │   ├── ProjectModal.tsx
│   │   ├── ResumeModal.tsx
│   │   ├── ReviewSuccessModal.tsx
│   │   └── ThemeToggle.tsx
│   ├── pages/               # Page components
│   │   ├── portfolio.tsx    # Main portfolio page
│   │   ├── ClientReviews.tsx
│   │   ├── AdminReviews.tsx
│   │   ├── ClientBookingModal.tsx
│   │   └── ContactSupport.tsx
│   ├── services/            # API services
│   ├── theme/               # Theme provider
│   └── i18n/                # Internationalization
├── admin.html               # Admin panel entry point
├── index.html               # Portfolio entry point
├── vite.config.portfolio.ts # Portfolio Vite config
├── vite.config.admin.ts     # Admin panel Vite config
└── .env                     # Frontend environment variables
```

## 🔐 Admin Panel Access

1. Start the admin dev server: `npm run dev:admin`
2. Navigate to `http://localhost:5174/admin.html`
3. Enter the admin key (set in `backend/.env` as `ADMIN_API_KEY`)
4. Use the key set in `backend/.env` as `ADMIN_API_KEY`. **Never use default keys in production.**

## 📧 Email Configuration

The application uses Web3Forms for email notifications. To set up:

1. Sign up at [Web3Forms.com](https://web3forms.com)
2. Enter your email address to get your access key
3. Add it to `backend/.env` as `WEB3FORMS_ACCESS_KEY`
4. Emails are sent to the address you configure (e.g. via `VITE_CONTACT_EMAIL` or your backend config)

## 🌐 API Endpoints

### Reviews
- `GET /api/reviews/` - List all reviews
- `POST /api/reviews/` - Create a new review
- `DELETE /api/reviews/{id}/` - Delete a review (requires admin key)

### Bookings
- `GET /api/bookings/` - List all bookings
- `POST /api/bookings/` - Create a new booking
- `DELETE /api/bookings/{id}/` - Delete a booking (requires admin key)

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 or 5174 is already in use:
- Kill the process using the port
- Or modify the port in `vite.config.portfolio.ts` / `vite.config.admin.ts`

### Database Connection Error

- Verify PostgreSQL is running
- Check credentials in `backend/.env`
- Ensure database `personal_portfolio` exists

### CORS Errors

- Verify `FRONTEND_ORIGIN` in `backend/.env` matches your frontend URL
- Check `backend/server/settings.py` CORS configuration

### Admin Panel Not Showing

- Access directly: `http://localhost:5174/admin.html`
- Check browser console for errors
- Clear Vite cache: `Remove-Item -Recurse -Force node_modules\.vite` (Windows)

## 🚀 Deployment

### Frontend

```bash
npm run build:portfolio  # Build portfolio
npm run build:admin      # Build admin panel
```

Deploy the `dist/portfolio` and `dist-admin` directories to your hosting service.

### Backend

1. Set `DJANGO_DEBUG=0` in production
2. Set a secure `DJANGO_SECRET_KEY`
3. Configure production database
4. Run `python manage.py collectstatic`
5. Use a production WSGI server (e.g., Gunicorn)

## 📝 License

This project is private and proprietary.

## 👤 Author

**John Wayne Enrique**
- Email: joma.enrique.up@phinmaed.com
- GitHub: [@Waynenyarky](https://github.com/Waynenyarky)

---

For issues or questions, please contact the author.
