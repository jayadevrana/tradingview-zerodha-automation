# Trading View Automation

A professional algo trading platform that connects TradingView signals with Zerodha for automated order execution.

## Features

- 🔗 **Zerodha Integration** - Connect your Zerodha account securely
- ⚡ **Zero Latency** - Execute trades instantly via webhooks
- 🛑 **Exit All Positions** - One-click to close all open positions
- 📊 **Premium Indicators** - Access our premium trading indicators
- 🛠️ **Custom Indicators** - Get custom indicators built for your strategy
- 📱 **Responsive UI** - Works on desktop and mobile

## Quick Start with Docker (Recommended)

1. **Install Docker Desktop** from [docker.com](https://docker.com/products/docker-desktop)

2. **Clone/Download this repository**

3. **Run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

4. **Open in browser:** http://localhost:3000

## Manual Setup (Without Docker)

### Prerequisites
- Node.js 18+ ([download](https://nodejs.org))
- Python 3.9+ ([download](https://python.org))
- MongoDB ([download](https://mongodb.com/try/download/community))

### Step 1: Start MongoDB
```bash
# On macOS with Homebrew
brew services start mongodb-community

# Or run directly
mongod --dbpath /path/to/data
```

### Step 2: Start Backend
```bash
cd backend
pip3 install -r requirements.txt
python3 -m uvicorn server:app --reload --port 8000
```

### Step 3: Start Frontend
```bash
cd frontend
npm install
npm start
```

### Step 4: Access the App
Open http://localhost:3000 in your browser

## Environment Variables

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=trading_automation
JWT_SECRET_KEY=your_secret_key_here
REACT_APP_FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

## Deployment

### Deploy to Production

1. **Backend:** Deploy to Railway, Render, or any Python hosting
2. **Frontend:** Build with `npm run build` and deploy to Vercel or Netlify
3. **Database:** Use MongoDB Atlas for cloud database

Update environment variables with production URLs.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/zerodha/connect` | Connect Zerodha account |
| GET | `/api/zerodha/connections` | Get broker connections |
| GET | `/api/zerodha/account-info` | Get account balance & positions |
| POST | `/api/zerodha/exit-all-positions` | Exit all open positions |
| POST | `/api/webhook/{user_id}` | TradingView webhook endpoint |
| GET | `/api/orders` | Get order history |

## Webhook Syntax

Use this JSON format in TradingView alerts:

```json
{
  "E": "NSE",
  "TS": "RELIANCE",
  "TT": "BUY",
  "Q": "10",
  "OT": "MARKET",
  "PT": "CNC"
}
```

## Support

- 📞 Phone: +919876543210
- 💬 WhatsApp: [Contact Us](https://wa.me/919876543210)

## Notes

Trading automation is infrastructure, not financial advice. No profit guarantees. Test in dry-run/paper before going live, and never commit real broker credentials — they belong only in your local `.env`.

## Stack

- **Backend:** Python, FastAPI, MongoDB (Motor), Zerodha Kite Connect
- **Frontend:** React (Create React App / CRACO), Tailwind CSS, shadcn-style UI
- **Deployment:** Docker Compose, Nginx

## License

MIT License — see [LICENSE](LICENSE).

## Author

Built by [Jayadev Rana](https://jayadevrana.in) — @bluealgocapital · [YouTube](https://www.youtube.com/@jayadevrana3657) · [GitHub](https://github.com/jayadevrana)
