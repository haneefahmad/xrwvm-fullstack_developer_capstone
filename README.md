# IBM Fullstack Developer Software Capstone Project

A full-stack dealership web application built as part of the **IBM Fullstack Developer Software Capstone Project**.

This project includes:
- Django backend (main application + API proxy)
- React frontend (dealers, reviews, auth, car inventory search)
- Node.js + MongoDB microservices
- Sentiment analysis integration for dealer reviews

## Features

- User registration, login, and logout
- View all dealerships and dealer details
- Search dealerships by state
- Post a review (authenticated users)
- Review sentiment analysis (positive/neutral/negative)
- Car inventory service integration
- Search/filter inventory by:
  - Make
  - Model
  - Year
  - Mileage
  - Price
- Modern responsive UI (desktop/tablet/mobile)
- Dark theme styling

## Tech Stack

- **Frontend:** React, React Router, CSS
- **Backend:** Django, Django REST-style JSON responses
- **Microservices:** Node.js, Express, MongoDB, Mongoose
- **Dev Tools:** Docker, docker-compose, npm, pip

## Project Structure

```text
xrwvm-fullstack_developer_capstone/
├── server/
│   ├── djangoproj/               # Django project settings and routes
│   ├── djangoapp/                # Django app (views, APIs, models)
│   ├── frontend/                 # React app
│   ├── database/                 # Dealer/review Node+Mongo service (:3030)
│   ├── carsInventory/            # Car inventory Node+Mongo service (:3050)
│   ├── manage.py
│   └── requirements.txt
└── README.md
```

## Prerequisites

- Python 3.10+
- Node.js 14+
- npm
- Docker Desktop (running)

## Environment Configuration

Edit:

`server/djangoapp/.env`

Example:

```env
backend_url=http://localhost:3030
sentiment_analyzer_url=https://sentianalyzer.26es7jvkmpp4.us-south.codeengine.appdomain.cloud/
searchcars_url=http://localhost:3050/
```

## Run Locally

### 1. Build frontend

```bash
cd server/frontend
npm install
npm run build
cd ..
```

### 2. Start Dealer/Review microservice (:3030)

```bash
cd database
docker build -t nodeapp .
docker compose up -d
cd ..
```

### 3. Start Cars Inventory microservice (:3050)

```bash
cd carsInventory
docker build -t nodeapp .
docker compose up -d
cd ..
```

### 4. Start Django server

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Open: [http://127.0.0.1:8000](http://127.0.0.1:8000)

## Key Routes

- `/` Home
- `/about` About page
- `/contact` Contact page
- `/dealers` Dealers list
- `/dealer/<id>` Dealer detail + reviews
- `/postreview/<id>` Add review
- `/searchcars/<id>` Inventory search for dealer

## Troubleshooting

### Docker daemon error
If you see:

`Cannot connect to the Docker daemon ...`

Start Docker Desktop:

```bash
open -a Docker
```

Then retry docker commands.

### Sentiment always neutral
- Verify `sentiment_analyzer_url` in `server/djangoapp/.env`
- Restart Django after `.env` changes
- Test endpoint directly with `curl`

### UI changes not visible
- Rebuild frontend (`npm run build`)
- Restart Django server
- Hard refresh browser (`Cmd + Shift + R`)

## Notes

- Build may show non-blocking `autoprefixer`/`browserslist` warnings.
- Repository may include generated files from local development (for example `.DS_Store`, `build`, `.venv`, `node_modules`) depending on local workflow.

## License

This project is licensed under the terms in the `LICENSE` file.
