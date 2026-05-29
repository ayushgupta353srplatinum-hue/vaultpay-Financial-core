# VaultPay Financial Core

A secure full-stack financial invoice management system built with MERN Stack, Stripe Payment Gateway, JWT Authentication, RBAC Security, PDF Receipt Generation, and Webhook Automation.

---

# Live Deployment

## Frontend (Vercel)

https://vaultpay-financial-core.vercel.app/

## Backend API (Render)

https://vaultpay-financial-core.onrender.com/

---

# Project Overview

VaultPay Financial Core is a secure enterprise-grade invoice management platform developed for Nexus Corporate Services.

The system allows:

* Admins to create and manage invoices
* Clients to securely log in and view only their own invoices
* Stripe-powered online payments
* Automatic webhook verification
* Dynamic PDF receipt generation
* Automated email delivery system
* Strict Role-Based Access Control (RBAC)
* IDOR Prevention for API security

This project was developed as a Final Commercial Delivery Assignment focused on financial transaction security and backend architecture.

---

# Tech Stack

## Frontend

* React.js
* React Router DOM
* Axios
* Context API
* CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

## Payment & Automation

* Stripe Checkout
* Stripe Webhooks
* PDFKit
* NodeMailer

## Deployment

* Vercel (Frontend)
* Render (Backend)

---

# Features

## Authentication System

* Secure JWT Login/Register
* Password protected sessions
* Token based authentication

## Role-Based Access Control (RBAC)

### Admin

* View all invoices
* Create invoices
* View revenue dashboard

### Client

* View only personal invoices
* Pay invoices securely
* Download receipts

---

# Security Features

## IDOR Prevention

The backend verifies invoice ownership before serving invoice data.

If a client attempts to access another client's invoice manually using invoice ID manipulation, the server instantly blocks the request with:

403 Forbidden

---

## Protected Routes

* Admin routes protected
* Client routes protected
* Unauthorized access redirects to custom 403 page

---

## Stripe Webhook Verification

Payment status is never trusted from frontend.

Stripe webhook cryptographic signature verification is implemented using:

stripe.webhooks.constructEvent()

Only verified Stripe events can mark invoices as Paid.

---

# Invoice System

## Admin Invoice Creation

Admins can:

* Select clients
* Set invoice amount
* Add descriptions
* Generate invoices instantly

---

## Client Dashboard

Clients can:

* View pending invoices
* Pay securely using Stripe
* Download verified PDF receipts

---

# Payment Flow

1. Client clicks Pay Invoice
2. Stripe Checkout opens
3. Payment completed
4. Stripe sends webhook event
5. Backend verifies signature
6. Invoice status updates to Paid
7. PDF receipt generated automatically
8. Email receipt delivered to client

---

# PDF Receipt Generation

PDF receipts are dynamically generated using PDFKit.

Receipts include:

* Invoice Details
* Client Information
* Amount Paid
* Paid Verification Stamp
* Company Branding

---

# Email Automation

After successful Stripe webhook verification:

* PDF receipt is attached automatically
* Receipt is emailed securely to client

Implemented using:

* NodeMailer
* Gmail SMTP

---

# API Security Architecture

Every protected API route:

* Verifies JWT Token
* Validates user role
* Prevents unauthorized data access

Implemented middleware:

* protect
* adminOnly

---

# Project Structure

backend/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── server.js
│
frontend/
│
├── src/
│ ├── components/
│ ├── context/
│ ├── pages/
│ ├── services/
│ ├── App.jsx
│ ├── main.jsx
│ └── App.css

---

# Environment Variables

## Backend .env

PORT=5000

MONGO_URI=your_mongodb_url

JWT_SECRET=your_jwt_secret

STRIPE_SECRET_KEY=your_stripe_secret

STRIPE_WEBHOOK_SECRET=your_webhook_secret

CLIENT_URL=https://vaultpay-financial-core.vercel.app

NODEMAILER_EMAIL=[your_email@gmail.com](mailto:your_email@gmail.com)

NODEMAILER_APP_PASSWORD=your_app_password

---

# Installation

## Clone Repository

git clone https://github.com/yourusername/vaultpay-financial-core.git

---

# Backend Setup

cd backend

npm install

npm run dev

---

# Frontend Setup

cd frontend

npm install

npm run dev

---

# Stripe Test Card

Card Number:
4242 4242 4242 4242

Expiry:
12/34

CVV:
123

ZIP:
12345

---

# Key Concepts Implemented

* JWT Authentication
* Role-Based Access Control
* Secure Financial Transactions
* Stripe Webhooks
* Zero-Trust API Architecture
* IDOR Prevention
* Dynamic PDF Generation
* Email Automation
* Protected Frontend Routes
* Secure Backend Validation

---

# Future Improvements

* AWS S3 PDF Storage
* Invoice Analytics
* Multi-Currency Support
* Admin Activity Logs
* Two-Factor Authentication
* Razorpay Integration
* Dark/Light Theme Toggle

---

# AI Usage Transparency

AI assistance was used for:

* Stripe Webhook debugging
* RBAC route protection logic
* PDFKit formatting
* Deployment troubleshooting
* UI optimization
* Security validation concepts

