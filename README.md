# Crypto Watcher

Crypto Watcher is a web application for monitoring cryptocurrency prices. It leverages React, Firebase and public crypto APIs to let users track favorite coins, view live charts and get notified when a price target is reached.

## Project Overview

- **Real‑time prices** from CoinPaprika and CryptoCompare
- **User authentication** through Firebase
- **Watchlist and alerts** stored in Firestore
- **News feed** for the selected coin
- **Responsive charts** powered by Chart.js

## Setup Instructions

1. Clone this repository and install dependencies:
   ```bash
   npm install
   ```
2. Configure the environment variables (see below).
3. Start the development server:
   ```bash
   npm start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

To create a production build run `npm run build`.

## Usage Examples

- **Register or log in** with your Google account.
- **Browse the dashboard** to see the top cryptocurrencies.
- **Select a coin** to open a detail page with price history and news.
- **Add coins to your watchlist** and set price alerts.
- **Open the converter** to quickly convert between coins.

## Environment Variables

Create a `.env.local` file in the project root and provide your keys:

```bash
REACT_APP_FIREBASE_API_KEY=your-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
REACT_APP_CRYPTOCOMPARE_API_KEY=your-cryptocompare-key
```

These variables are loaded automatically when running `npm start` or `npm run build`.
