# EventLink CM
EventLink CM is a Django web application designed to connect
event organizers with participants.
## Technology Stack
- HTML
- CSS
- JavaScript
- Django
- Django REST Framework
- PostgreSQL
## Main Features
### Organizers
- Create events
- Edit events
- Launch events
- Set registration limits
- View registered participants
- Scan participant tickets
- Track attendance
- View event reports
### Participants
- Create an account
- Verify email
- Browse launched events
- Register for free events
- Receive a digital ticket
- Use a QR code ticket
- View attendance status
- Receive notifications
## Payment
The first version uses free tickets only.
Payment integration can be added in a later version.
## Local Setup
### 1. Clone the repository
```bash
git clone YOUR_REPOSITORY_URL
cd EventLink-CM

2. Create a virtual environment

python -m venv venv

3. Activate it

Linux/macOS:

source venv/bin/activate

Windows:

venv\Scripts\activate

4. Install dependencies

pip install -r requirements.txt

5. Create environment variables

Copy:

.env.example

to:

.env

Then enter your local PostgreSQL settings.

6. Create migrations

python manage.py makemigrations

7. Apply migrations

python manage.py migrate

8. Create an administrator

python manage.py createsuperuser

9. Run the development server

python manage.py runserver

Open:

http://127.0.0.1:8000/

Django Admin:

http://127.0.0.1:8000/admin/

PostgreSQL

The application uses PostgreSQL as its main database.

The connection is configured through:

DATABASE_URL

Example:

postgresql://postgres:password@localhost:5432/eventlink_cm

Environment Variables

Never commit .env to GitHub.

Use .env.example as the template for other developers.

Team Structure

Person 1

Infrastructure and configuration.

Person 2

Database models and API.

Person 3

Frontend and user interface.

Development Workflow

Each team member should work on a separate branch.

Example:

git checkout -b role-1-infrastructure

After completing work:

git add .
git commit -m "Configure Django infrastructure"
git push -u origin role-1-infrastructure

Create a Pull Request before merging into main.

:::
---
# 14. Create the folders
If any of these don't exist, from the project root run:
```bash
mkdir -p core
touch core/__init__.py
touch core/settings.py
touch core/urls.py
touch core/asgi.py
touch core/wsgi.py

You should now have:

EventLink-CM/
│
├── manage.py
├── requirements.txt
├── .env
├── .env.example
├── .gitignore
├── README.md
├── Procfile
├── render.yaml
│
├── core/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── api/
│   └── ...
│
├── templates/
│   └── ...
│
└── static/
    └── ...

15. Install everything

Run:

pip install -r requirements.txt

Then check Django:

python manage.py check

If you get:

System check identified no issues

that’s a good sign. ✅

Then test PostgreSQL

Once your .env has the correct PostgreSQL DATABASE_URL:

python manage.py makemigrations
python manage.py migrate

Then:

python manage.py runserver

And open port 8000 in Codespaces.

One important thing

The views.py I gave Person 2 earlier has a few line-break formatting issues that would cause Python syntax errors if copied exactly. Before we run migrations or start the server, we should correct Person 2’s api/views.py. That way Person 1’s infrastructure and Person 2’s API work together cleanly.