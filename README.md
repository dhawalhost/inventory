# Grocery Inventory Frontend (React)

This is a basic React app for your home grocery inventory, connected to a Golang backend.

## Features

- Register and login (JWT-based)
- Add, view, and filter items
- Organize by categories
- Protected dashboard

## Setup

1. `npm install`
2. Set your backend API URL in `src/api/axios.js` if different from `http://localhost:8080/api`
3. `npm start`

## Backend requirements

- Exposes endpoints as described above
- CORS enabled

## Extending

- Add edit/delete for items/categories
- Add transaction tracking
- Add expiry/low stock alerts