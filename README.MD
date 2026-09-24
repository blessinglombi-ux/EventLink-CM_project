# EventLink CM 🎫🇨🇲
**EventLink CM** is a free, modern event management, ticketing, and live gate check-in platform tailored for universities, developer communities, and cultural organizers across Cameroon.
Built with **Python (Django)**, **PostgreSQL**, and modern **HTML5, CSS3, JavaScript** (powered by `html5-qrcode` for camera scanning and `Chart.js` for analytics).
---
Built with **Python (Django)**, **PostgreSQL**, and modern **HTML5, CSS3, JavaScript** (powered by `html5-qrcode` for camera scanning and `Chart.js` for analytics).

---

## 👥 Team Breakdown & Roles

### 🧑‍💻 Member 1 (Organizer & Operations Suite)
- **Foundation & Core Configuration:** Django settings, PostgreSQL integration, custom User model.
- **Authentication & Roles:** Organizer vs Participant registration & login, profile editing with avatars.
- **Event Creation:** Capacity limits, venue, schedule, free ticket tiers, poster/flyer upload.
- **Ticket Designer:** Color customization, admission rules, and launch-to-public controls.
- **Camera QR Scanner:** Real-time web camera scanner powered by `html5-qrcode` & backend verification API.
- **Organizer Dashboard:** Attendee counts, capacity progress bars, and Chart.js analytics.

### 🧑‍💻 Member 2 (Participant & Discovery Suite)
- **Landing Page:** Interactive animations, About Us, and Purpose of the website.
- **Event Discovery:** Search bar, category filters, and event detail view.
- **Ticket Wallet & Downloads:** Participant ticket badge, printable/PDF export.
- **Participant Dashboard:** Event registration history, attendance statistics.
- **Reviews & Ratings:** Event feedback to boost organizer profile achievements.

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/EventLink-CM.git
cd EventLink-CM
```

### 2. Create and Activate Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Database Setup (PostgreSQL)
1. Ensure PostgreSQL service is running.
2. Create the database:
   ```sql
   CREATE DATABASE eventlink_cm_db;
   ```
3. Copy `.env.example` to `.env` and fill in your PostgreSQL credentials:
   ```ini
   SECRET_KEY=your-secret-key
   DEBUG=True
   DB_NAME=eventlink_cm_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   ```
   *(Note: Set `USE_SQLITE=True` in `.env` if you want to test with SQLite locally before configuring PostgreSQL).*

### 5. Run Migrations & Seed Default Data
```bash
python manage.py makemigrations accounts events tickets dashboards
python manage.py migrate
```

### 6. Create Superuser (Admin)
```bash
python manage.py createsuperuser
```

### 7. Run Local Development Server
```bash
python manage.py runserver
```
Visit `http://127.0.0.1:8000/` in your browser.



## 📸 Camera Gate Check-In Instructions
1. Log in with an **Organizer** account.
2. Go to **Dashboard** &rarr; click **Gate Scanner** (or navigate to `/tickets/scanner/`).
3. Allow camera access in the browser prompt.
4. Point the camera at any attendee's digital ticket or printed paper.
5. The system automatically validates the ticket UUID, displays the attendee's name and tier, and marks them checked in on PostgreSQL.

---

## 🎨 Logo Customization
Drop your uploaded logo file into:
```text
static/images/logo.png
```
It is automatically referenced across the navbar, footer, and ticket badges.
