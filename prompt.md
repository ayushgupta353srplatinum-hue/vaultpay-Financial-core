
# AI Usage Transparency Document

This project was developed with partial AI-assisted guidance for debugging, architecture understanding, deployment troubleshooting, and implementation of advanced backend security concepts.

The following prompts, debugging sessions, and AI-assisted workflows were used during the development lifecycle of VaultPay Financial Core.

---

# Project Name

VaultPay Financial Core

Secure Financial Invoice Management System

---

# Major Technical Problems Faced During Development

The project involved multiple enterprise-grade backend and security concepts that required advanced debugging and architectural validation.

The following areas required AI-assisted support.

---

# 1. JWT Authentication & Role-Based Access Control (RBAC)

## Problem Faced

Implementing:

* Admin and Client roles
* Protected frontend routes
* Backend middleware authorization
* Secure dashboard redirection
* Unauthorized route blocking

The challenge was ensuring:

* Clients could never access admin routes
* Admin APIs stayed protected
* Route guards worked even on manual URL access

## AI Prompt Used

"Help me implement strict RBAC authentication using JWT in MERN stack where admin and client dashboards are separated and unauthorized users are redirected to a 403 page."

---

# 2. IDOR Prevention (Insecure Direct Object Reference)

## Problem Faced

The backend initially allowed invoice access using invoice IDs directly from URLs.

This created a security risk where one client could potentially access another client’s invoice.

## AI Prompt Used

"How can I prevent IDOR vulnerabilities in Express.js invoice APIs using JWT ownership validation?"

---

# 3. Stripe Payment Gateway Integration

## Problem Faced

Integrating:

* Stripe Checkout Session
* Payment redirection
* Secure invoice mapping
* Stripe metadata handling

The payment flow required:

* Preventing duplicate payments
* Disabling buttons during loading
* Safe session handling

## AI Prompt Used

"Help me integrate Stripe Checkout in MERN stack with invoice-based payment flow and loading state protection."

---

# 4. Stripe Webhook Signature Verification

## Problem Faced

Webhook verification repeatedly failed in production due to:

* Incorrect request body parsing
* express.json() conflicts
* Invalid Stripe signatures
* Render deployment issues

This was the most complex backend debugging challenge.

## AI Prompt Used

"How do I correctly implement Stripe webhook signature verification using express.raw() in Node.js Express backend deployed on Render?"

---

# 5. Webhook Production Deployment Issues

## Problem Faced

Local Stripe CLI worked successfully, but production webhook events failed after deployment.

The issues included:

* Webhook endpoint configuration
* Incorrect signing secret
* Raw body parsing conflicts
* Vercel and Render domain mismatches

## AI Prompt Used

"Stripe webhook works locally but fails on Render deployment. How do I properly configure production webhook verification?"

---

# 6. PDF Receipt Generation using PDFKit

## Problem Faced

Generating dynamic invoice receipts after successful payment required:

* PDF formatting
* Dynamic data injection
* Buffer generation
* Download handling
* Branding and watermark support

## AI Prompt Used

"Generate a professional PDF invoice receipt using PDFKit with company branding and paid watermark."

---

# 7. NodeMailer Email Automation

## Problem Faced

After webhook verification:

* PDF receipts needed to be attached automatically
* Emails needed to send securely using Gmail SMTP
* Environment variable handling caused deployment failures

## AI Prompt Used

"How can I automatically email generated PDF receipts using NodeMailer after Stripe webhook payment confirmation?"

---

# 8. Deployment Issues (Render + Vercel)

## Problem Faced

Deployment required solving:

* CORS configuration
* Environment variables
* Production API URLs
* Frontend/backend communication
* Webhook public endpoint setup

## AI Prompt Used

"Help me deploy MERN stack project with Vercel frontend and Render backend including Stripe webhook support."

---

# 9. Frontend Dashboard Architecture

## Problem Faced

The frontend dashboards required:

* Dynamic invoice rendering
* Loading states
* Stripe payment states
* PDF download handling
* Protected navigation

## AI Prompt Used

"Create clean React dashboard architecture for invoice management system with protected routes and secure payment flow."

---

# 10. CSS Refactoring & Component Cleanup

## Problem Faced

Inline styles made the project difficult to maintain.

The entire frontend needed:

* CSS extraction
* Class-based styling
* Clean structure
* UI consistency

## AI Prompt Used

"Convert inline React styles into centralized App.css without changing logic or design structure."

---

# Key Security Concepts Implemented

* JWT Authentication
* RBAC Authorization
* Protected Routes
* IDOR Prevention
* Stripe Webhook Verification
* Secure API Validation
* Token Verification
* Backend Ownership Checks

---

# AI Assistance Scope

AI assistance was used only for:

* Debugging
* Architecture understanding
* Security validation
* Deployment troubleshooting
* Code refactoring guidance
* PDF formatting logic
* Stripe webhook implementation support

Final project integration, testing, deployment, debugging flow management, and complete application assembly were handled manually.

---

# Final Outcome

Successfully developed and deployed a secure financial transaction platform with:

* Role-Based Authentication
* Stripe Payment Integration
* Webhook Verification
* Dynamic PDF Generation
* Automated Email Delivery
* Invoice Management
* Protected APIs
* Production Deployment

---

# Live Links

Frontend:
https://vaultpay-financial-core.vercel.app/

Backend:
https://vaultpay-financial-core.onrender.com/

