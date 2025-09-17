# QR
#
## Backend Setup & Run Instructions

### Prerequisites
- Docker installed
- Node.js (optional, for local development)
- `.env` file with required environment variables (see below)

### 1. Prepare Environment Variables
Create a file named `.env` inside the `BACKEND/` folder. Example:

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_token_secret_key
```

### 2. Build Docker Image
Run this command from the project root:

```sh
docker build -t qr-backend ./BACKEND
```

### 3. Run Docker Container
Run the container with your `.env` file:

```sh
docker run --env-file ./BACKEND/.env -p 3000:3000 qr-backend
```

### 4. Access the App
The backend will be available at `http://localhost:3000` (or the port you expose).

---
For local development (without Docker):

```sh
cd BACKEND
npm install
node app.js
```

---
For any issues, check logs and ensure your `.env` variables are set correctly.