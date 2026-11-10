# ॐ SRI ANVAYA — SRADHAM 360 PLATFORM
## Comprehensive Master Technical Documentation & System Architecture Manual

> **Version**: 1.0.0 (Production Release)  
> **Repository**: `d:\Antigravity\Anvaya V1`  
> **Last Updated**: August 2026  
> **Platform Status**: Fully Operational & Connected to Live Cloud Infrastructure

---

## Table of Contents
1. [Executive Summary & Core Philosophy](#1-executive-summary--core-philosophy)
2. [Fullstack Architecture & Technology Stack](#2-fullstack-architecture--technology-stack)
3. [Portal Ecosystem & Key Modules](#3-portal-ecosystem--key-modules)
   - [A. Public Website & Dynamic Pricing Catalog](#a-public-website--dynamic-pricing-catalog)
   - [B. Customer Portal & 8-Step Onboarding Engine](#b-customer-portal--8-step-onboarding-engine)
   - [C. Vedic Provider Portal (Mobile-First)](#c-vedic-provider-portal-mobile-first)
   - [D. Enterprise Admin Control Center](#d-enterprise-admin-control-center)
4. [Newly Implemented Capabilities & Highlights](#4-newly-implemented-capabilities--highlights)
   - [Multi-Cloud Storage Hub (Cloudinary, AWS S3, Azure Blob)](#multi-cloud-storage-hub)
   - [Dynamic Sradham 360 Plan Engine (Add/Edit/Delete)](#dynamic-sradham-360-plan-engine)
   - [Database Backup & Disaster Recovery Engine (JSON)](#database-backup--disaster-recovery-engine)
   - [In-App Printable Tax Invoice & Official Receipt System](#in-app-printable-tax-invoice--receipt-system)
   - [Top-Right Profile Menu & Session Termination](#top-right-profile-menu--session-termination)
5. [Local Development & Deployment Guide](#5-local-development--deployment-guide)
6. [Environment Variables Reference (`.env`)](#6-environment-variables-reference-env)
7. [Default Seed Credentials & Test Accounts](#7-default-seed-credentials--test-accounts)
8. [API Endpoint Reference Matrix](#8-api-endpoint-reference-matrix)
9. [Database Schema & Data Model Matrix](#9-database-schema--data-model-matrix)
10. [Disaster Recovery & Backup Standard Operating Procedure](#10-disaster-recovery--backup-standard-operating-procedure)

---

## 1. Executive Summary & Core Philosophy

**Sri Anvaya** is a purpose-built, full-lifecycle digital platform designed to bring dignity, structure, and peace of mind to sacred Hindu ancestral ceremonies (*Sradham / Thithi Karma / Pitru Tarpanam*).

### Core Pillars
1. **Pavitram & Authenticity**: Strict adherence to orthodox Vedic traditions across Smartha, Vadakalai, Thenkalai, and Madhwa sampradayams.
2. **Predictable Monthly Subscriptions (Sradham 360)**: Removing financial spikes and planning anxiety by distributing annual ritual expenses across predictable monthly installments.
3. **Four-Member Dedicated Ritual Team**:
   - **Chief Purohith / Vadhyar**: Conducts sacred mantras, Sankalpam, and Homam.
   - **Swamigal 1 & Swamigal 2 (Bhoktas)**: Represent the Pitrus and Vishwadevas.
   - **Orthodox Madi Cook (Swayampak)**: Prepares pure sattvic madi bhojanam strictly according to ancestral dietary rules.
4. **12% Vedic Provider Welfare Covenant**: Sri Anvaya sets aside 12% of ritual earnings directly into a dedicated provider welfare fund for healthcare, family emergencies, and retirement support for traditional Vaidikas.

---

## 2. Fullstack Architecture & Technology Stack

```
+-------------------------------------------------------------------------+
|                              FRONTEND APP                                |
|             Next.js 14 (App Router) + React 18 + TailwindCSS             |
|           Cinzel / Playfair Serif / Plus Jakarta Sans Typography        |
+------------------------------------+------------------------------------+
                                     |  HTTP REST / Bearer JWT
                                     v
+-------------------------------------------------------------------------+
|                               BACKEND API                                |
|                NestJS 10 Framework + TypeScript Core                    |
|          Controllers -> Guards -> Services -> DataStore / Mongo         |
+------------------------------------+------------------------------------+
                                     |
       +-----------------------------+-----------------------------+
       |                             |                             |
       v                             v                             v
+---------------+            +---------------+             +---------------+
|    DATABASE   |            | MULTI-CLOUD   |             |   GATEWAYS    |
| MongoDB Atlas |            |   STORAGE     |             | Razorpay      |
| Cloud Cluster |            | - Cloudinary  |             | Stripe        |
| (Mongoose ORM)|            | - AWS S3      |             | WhatsApp API  |
|               |            | - Azure Blob  |             | SMTP SendGrid |
+---------------+            +---------------+             +---------------+
```

### Technology Matrix
| Layer | Technologies Used |
|---|---|
| **Frontend Framework** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling & UI Design** | Vanilla TailwindCSS, Curated Heritage Theme (`maroon`, `gold`, `canvas`, `warmwhite`, `sand`), Lucide React Icons |
| **Backend Framework** | NestJS 10, Express, TypeScript, Node.js |
| **Database & ODM** | MongoDB Atlas Cloud Cluster (`cluster0.avjoegu.mongodb.net`), Mongoose ODM, In-Memory Seed Fallback |
| **Cloud File Storage** | Cloudinary SDK (`gc2damux`), Amazon AWS S3, Microsoft Azure Blob Storage |
| **Payment Gateways** | Razorpay (India INR), Stripe (Global USD/EUR/GBP) |
| **Communications** | WhatsApp Business API, Nodemailer / SMTP SendGrid, DLT SMS Gateway |

---

## 3. Portal Ecosystem & Key Modules

### A. Public Website & Dynamic Pricing Catalog
- **Homepage (`/`)**: Vedic storytelling, 4-stage visual journey, 12% welfare covenant, and **Live Dynamic Pricing Grid** fetched directly from `/api/plans`.
- **Service Pages**:
  - `/sradham-360`: Deep explanation of the all-inclusive subscription model.
  - `/how-it-works`: 4-step walkthrough from onboarding to final ancestral archana.
  - `/plans`: Full dynamic catalog with itemized inclusion bullets.
  - `/about`, `/faq`, `/contact`: Organizational mission and contact details.
- **Authentication**: `/login` (with 1-click test role logins) and `/register`.

### B. Customer Portal & 8-Step Onboarding Engine
- **Dashboard (`/customer/dashboard`)**: Sradham countdown timer, assigned 4-member ritual team, checklist progression, and active subscription state.
- **8-Step Guided Onboarding Wizard (`/customer/onboarding`)**:
  1. Personal Information & WhatsApp contact.
  2. Family Heritage, Gothram, Kuladeivam & Native Kshetra.
  3. Pitru Records & Genealogy (Relationship, Varna, Departure date).
  4. Calendar & Lunar Tithi Computation (Sauramana vs Chandramana).
  5. Ceremony Venue & Address.
  6. Sampradayam Alignment & Dietary Rules (Strict Madi kitchen).
  7. Choose Sradham 360 Plan (Live fetched from backend).
  8. Payment Method & Initial Activation.
- **Family Tree (`/customer/family`)**: Lineage management and relationship mapping.
- **Pitru Vault (`/customer/pitru-records`)**: Complete ancestral records with lunar thithi and departure document uploads.
- **Payments & Receipts (`/customer/payments`)**: Itemized transaction ledger with in-app printable official Tax Invoices.

### C. Vedic Provider Portal (Mobile-First)
- **Dashboard (`/provider/dashboard`)**: Upcoming ceremony assignments, quick confirmation buttons, and monthly earnings gauge.
- **Assigned Ceremonies (`/provider/events`)**: Deep ritual details, venue GPS map links, host contact, and ceremony execution steps (**"Mark Arrived"** -> **"Mark Completed"**).
- **Availability Calendar (`/provider/availability`)**: Set sacred blackout dates and working availability.
- **Earnings & Dakshina Ledger (`/provider/earnings`)**: Ceremony dakshina history and breakdown.
- **12% Welfare Wallet (`/provider/wallet`)**: Provider welfare balance, medical claims support, and retirement fund tracking.

### D. Enterprise Admin Control Center
- **Executive Dashboard (`/admin/dashboard`)**: Operational KPIs, ceremony funnel, revenue growth, and active provider health.
- **Customer Directory (`/admin/customers`)**: Complete customer 360° overview with family lineage and Pitru records.
- **Ceremonies & 4-Member Assignment Engine (`/admin/events`)**: Intelligent assignment modal to dispatch:
  - 1 Chief Purohith (Vadhyar)
  - 2 Swamigals (Bhoktas)
  - 1 Orthodox Madi Cook
- **Subscription Plan Management (`/admin/subscriptions`)**: Complete CRUD interface for Sradham 360 packages and live customer enrollment tracking.
- **Provider Registry (`/admin/providers`)**: Verified Vaidikas and Cooks with sampradayam tags and ratings.
- **Welfare Wallet Reconciliation (`/admin/welfare-wallet`)**: Live wallet consolidation and month-end disbursement engine.
- **Infrastructure & Disaster Recovery Hub (`/admin/settings`)**: Live configuration for databases, multi-cloud storage, payment gateways, and JSON backup export/import.

---

## 4. Newly Implemented Capabilities & Highlights

### Multi-Cloud Storage Hub
- **Location**: `/admin/settings` (Tab 1)
- **Supported Providers**:
  1. **Cloudinary Media**: Instant image optimization, CDN distribution, and HMAC-SHA256 signature verification.
  2. **Amazon AWS S3**: High-throughput bucket uploads (`AWS_S3_BUCKET`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).
  3. **Microsoft Azure Blob Storage**: Enterprise container storage (`AZURE_STORAGE_ACCOUNT`, `AZURE_STORAGE_CONTAINER`, `AZURE_STORAGE_CONNECTION_STRING`).
- **Runtime Provider Switching**: 1-click active provider switcher updates `STORAGE_PROVIDER` in `.env` without server restart.
- **Ping Test Integration**: Dedicated **"Test Endpoint Ping"** buttons for AWS S3 and Azure Blob containers.

### Dynamic Sradham 360 Plan Engine
- **Location**: `/admin/subscriptions`
- **Capabilities**:
  - **Add New Plan**: Define plan name, code, monthly rate (₹), annual equivalent, description, dynamic bullet inclusions, recommended badge, and active status.
  - **Edit Plan**: Live modification of existing plan pricing and inclusions.
  - **Delete Plan**: Safe deletion with confirmation modal.
  - **Dynamic Website Propagation**: Changes immediately reflect on the homepage pricing grid (`/`), the plans page (`/plans`), and customer onboarding step 7 (`/customer/onboarding`).

### Database Backup & Disaster Recovery Engine
- **Location**: `/admin/settings` (Tab 2)
- **1-Click JSON Export**: Downloads complete snapshot of all 16 database collections with metadata and record tallies.
- **Verified JSON Snapshot Import**:
  - `OVERWRITE` Mode: Clean reset and restore.
  - `MERGE` Mode: Upsert existing records by `_id` and append new records.
  - Interactive file selection and JSON preview modal before execution.

### In-App Printable Tax Invoice & Receipt System
- **Locations**: `/customer/payments` & `/admin/payments`
- **Features**:
  - Displays official Sri Anvaya sacred emblem (`ॐ`), billing coordinates, GST compliance, ceremony dates, and dakshina breakdown.
  - **"Print / Save as PDF"** button triggers clean, printer-friendly CSS print stylesheet via `window.print()`.

### Top-Right Profile Menu & Session Termination
- **Locations**: `TopHeader.tsx` (all portals) and `Navbar.tsx` (public site).
- **Features**: Interactive dropdown showing user avatar, name, email, verified role badge, profile link, and **Log Out** button (clears JWT session and redirects to `/login`).

---

## 5. Local Development & Deployment Guide

### Prerequisites
- **Node.js**: v18.x or v20.x
- **NPM**: v9.x or higher
- **OS**: Windows / Linux / macOS

### Quick Start Commands (Windows PowerShell)

```powershell
# 1. Clone & Enter Project
cd "d:\Antigravity\Anvaya V1"

# 2. Start Backend API Server (Port 4000)
cd backend
npm.cmd run build
node dist/main.js

# 3. In a separate terminal, start Frontend Dev Server (Port 3000)
cd "d:\Antigravity\Anvaya V1\frontend"
npm.cmd run dev
```

### Accessing the Platform
- **Public Marketing Website**: [http://localhost:3000](http://localhost:3000)
- **Plans & Inclusions Catalog**: [http://localhost:3000/plans](http://localhost:3000/plans)
- **Customer Onboarding Wizard**: [http://localhost:3000/customer/onboarding](http://localhost:3000/customer/onboarding)
- **Admin Control Center**: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)
- **Admin Subscription Plan Hub**: [http://localhost:3000/admin/subscriptions](http://localhost:3000/admin/subscriptions)
- **Admin Infrastructure & Storage Settings**: [http://localhost:3000/admin/settings](http://localhost:3000/admin/settings)
- **Backend API Base**: [http://localhost:4000/api](http://localhost:4000/api)

---

## 6. Environment Variables Reference (`.env`)

File location: `d:\Antigravity\Anvaya V1\backend\.env`

```env
# Application Runtime
PORT=4000
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
JWT_SECRET=srianvaya_super_secret_jwt_key_2026_vedic_heritage

# MongoDB Database
MONGODB_URI=mongodb+srv://balusiva1299:Siva2312@cluster0.avjoegu.mongodb.net/srianvaya_db?retryWrites=true&w=majority

# Active Storage Provider: 'cloudinary' | 'aws_s3' | 'azure_blob'
STORAGE_PROVIDER=cloudinary

# Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME=gc2damux
CLOUDINARY_API_KEY=121852572457978
CLOUDINARY_API_SECRET=Tgs7Rk79b_qulR9a4mHTQMkNK-E

# Amazon AWS S3 Configuration
AWS_S3_BUCKET=sri-anvaya-vault
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# Microsoft Azure Blob Storage Configuration
AZURE_STORAGE_ACCOUNT=srianvayastorage
AZURE_STORAGE_CONTAINER=pitru-records
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=srianvayastorage;AccountKey=sample...;EndpointSuffix=core.windows.net

# Payment Gateways
PAYMENT_PROVIDER=razorpay
RAZORPAY_KEY_ID=rzp_test_srianvaya12345
RAZORPAY_KEY_SECRET=rzp_secret_key_sample
RAZORPAY_WEBHOOK_SECRET=rzp_webhook_secret_sample

STRIPE_PUBLISHABLE_KEY=pk_test_sample
STRIPE_SECRET_KEY=sk_test_sample
STRIPE_WEBHOOK_SECRET=whsec_sample

# Communications (WhatsApp, SMTP, SMS)
WHATSAPP_PROVIDER=Gupshup Enterprise
WHATSAPP_API_KEY=waba_live_sample_token
WHATSAPP_SENDER_NUMBER=+919884012345

SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.sample_sendgrid_key
SMTP_FROM=care@srianvaya.com

SMS_PROVIDER=DLT Fast2SMS
SMS_API_KEY=fast2sms_api_key_sample
SMS_SENDER_ID=ANVAYA
```

---

## 7. Default Seed Credentials & Test Accounts

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Super Admin** | `admin@srianvaya.com` | `SriAnvaya@2026` | Full platform control, infrastructure settings, team assignment, plan CRUD |
| **Chief Vadhyar** | `krishna.vadhyar@srianvaya.com` | `SriAnvaya@2026` | Provider dashboard, ritual checklist, arrival/completion, welfare wallet |
| **Customer / Kartha** | `sundaram.sharma@example.com` | `SriAnvaya@2026` | Customer portal, Pitru vault, family tree, payments, subscriptions |
| **Operations Lead** | `operations@srianvaya.com` | `SriAnvaya@2026` | Event logistics, provider tracking, dakshina dispatch, communications |

---

## 8. API Endpoint Reference Matrix

### Authentication (`/api/auth`)
- `POST /api/auth/register`: Register new customer or provider.
- `POST /api/auth/login`: Authenticate and receive JWT token.
- `GET /api/auth/me`: Get current authenticated user profile.

### Plans Engine (`/api/plans`)
- `GET /api/plans`: Get all subscription plans.
- `GET /api/plans/active`: Get active plans for public catalog.
- `GET /api/plans/:id`: Get plan details by ID or code.
- `POST /api/plans`: Create a new subscription plan (Admin only).
- `PUT /api/plans/:id`: Update existing plan pricing and inclusions (Admin only).
- `DELETE /api/plans/:id`: Remove plan from catalog (Admin only).

### Customers & Onboarding (`/api/customers`)
- `GET /api/customers/me`: Get customer profile and onboarding state.
- `PUT /api/customers/onboarding`: Save onboarding step data.
- `GET /api/customers/all`: List all customers (Admin only).

### Pitru Records (`/api/pitru-records`)
- `GET /api/pitru-records`: Get customer Pitru records.
- `POST /api/pitru-records`: Add new Pitru entry with lunar tithi.
- `PUT /api/pitru-records/:id`: Update Pitru details.
- `DELETE /api/pitru-records/:id`: Remove Pitru record.

### Ceremonies & Events (`/api/events`)
- `GET /api/events/my`: Get ceremonies for current user (Customer or Provider).
- `GET /api/events/all`: List all ceremonies across platform (Admin).
- `GET /api/events/:id`: Get detailed ceremony worksheet.
- `PUT /api/events/:id/status`: Update ceremony lifecycle status.
- `PUT /api/events/:id/checklist`: Update ritual checklist items.

### 4-Member Team Assignments (`/api/assignments`)
- `GET /api/assignments/my`: Get provider assigned ceremonies.
- `POST /api/assignments/assign-team`: Dispatch 4-member ritual team (Admin).
- `POST /api/assignments/:id/respond`: Accept or decline ceremony assignment.
- `POST /api/assignments/:id/arrive`: Mark provider arrival at venue.
- `POST /api/assignments/:id/complete`: Mark ceremony completion.

### Payments & Invoices (`/api/payments`)
- `POST /api/payments/create-order`: Create Razorpay or Stripe order session.
- `POST /api/payments/verify`: Verify payment signature and activate subscription.
- `GET /api/payments/my`: List customer transaction history and tax receipts.
- `GET /api/payments/all`: Administrative collections ledger.

### Welfare Wallet (`/api/wallet`)
- `GET /api/wallet/me`: Get provider wallet balance and 12% allocation.
- `GET /api/wallet/admin/reconciliation`: Administrative welfare reconciliation view.
- `POST /api/wallet/admin/consolidate`: Batch run month-end welfare consolidation.

### Multi-Cloud Uploads & Documents (`/api/uploads`)
- `GET /api/uploads/signed-url`: Generate signed upload URL for active storage provider (Cloudinary, AWS S3, or Azure Blob).
- `DELETE /api/uploads/:publicId`: Delete file from active storage.

### Infrastructure & Settings (`/api/settings`)
- `GET /api/settings/infra-config`: Fetch all service configurations and secret status.
- `PUT /api/settings/infra-config/:service`: Update configuration for database, storage, or gateway.
- `POST /api/settings/test-connection/:service`: Execute live connection ping test.
- `GET /api/settings/backup/export`: Download complete JSON database snapshot.
- `POST /api/settings/backup/import`: Restore database from JSON backup snapshot.

---

## 9. Database Schema & Data Model Matrix

The platform orchestrates **16 distinct collections**:

1. `users`: Authentication identities, password hashes, verified roles.
2. `customers`: Customer profiles, primary addresses, onboarding progression.
3. `families`: Lineage metadata, Gothram, Kuladeivam, native place.
4. `pitruRecords`: Ancestor identities, relationship, lunar tithi, nakshatra, departure certificates.
5. `plans`: Sradham 360 subscription tiers, monthly rates, annual values, inclusions list.
6. `subscriptions`: Customer recurring memberships, billing cycles, auto-renewal flags.
7. `payments`: Transaction records, gateway order IDs, tax invoices, receipt numbers.
8. `events`: Ceremony instances, computed dates, venue coordinates, status, checklists.
9. `providers`: Vaidika profiles, sampradayam tags, ratings, experience years.
10. `assignments`: 4-member allocation records (Vadhyar, 2 Swamigals, Cook).
11. `earnings`: Dakshina compensation records for providers.
12. `wallets`: Provider 12% welfare balances.
13. `walletTransactions`: Welfare credit and debit ledger.
14. `notifications`: In-app, WhatsApp, SMS, and email dispatches.
15. `systemSettings`: Global configuration tokens and welfare percentage rules.
16. `auditLogs`: Security and compliance audit trail.

---

## 10. Disaster Recovery & Backup Standard Operating Procedure

### Creating a Routine Backup Snapshot
1. Log into the **Admin Portal** -> Navigate to **Settings** (`/admin/settings`).
2. Click on the **"Database Backup & Disaster Recovery (JSON)"** tab.
3. Click the **"Export Database Backup (JSON)"** button.
4. Store the downloaded `sri-anvaya-database-backup-YYYY-MM-DD.json` file in a secure, encrypted offline or secondary cloud vault.

### Restoring from a Backup Snapshot
1. On the same **Backup & Disaster Recovery** tab, drag and drop the JSON backup file into the restore area.
2. Inspect the file metadata (Record counts across all 16 collections).
3. Select the Restore Mode:
   - **`OVERWRITE`**: Recommended for clean server restores and environment cloning.
   - **`MERGE`**: Recommended for importing records without overwriting newer records.
4. Click **"Restore Database Snapshot"** and confirm in the security prompt.
5. The system will process all collections and report the total restored records with zero downtime.

---

*ॐ शान्तिः शान्तिः शान्तिः — Sri Anvaya Sradham 360 Platform*
