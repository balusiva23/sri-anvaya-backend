# ॐ Sri Anvaya — Sradham 360 Platform
## Quick Reference: Project URLs, Login Credentials & Technology Stack

---

## 1. Project URLs & Navigation Directory

### 🌐 Live Production Links
| Destination | URL | Description |
|---|---|---|
| **Public Website** | [https://sriavanya.netlify.app/](https://sriavanya.netlify.app/) | Marketing landing page, Vedic journey & stories |
| **Sradham 360 Dynamic Plans** | [https://sriavanya.netlify.app/plans](https://sriavanya.netlify.app/plans) | Dynamic subscription tiers & inclusions |
| **How It Works** | [https://sriavanya.netlify.app/how-it-works](https://sriavanya.netlify.app/how-it-works) | 4-step ritual execution guide |
| **Sign In / Login** | [https://sriavanya.netlify.app/login](https://sriavanya.netlify.app/login) | Role-based authentication portal |
| **Customer Registration** | [https://sriavanya.netlify.app/register](https://sriavanya.netlify.app/register) | New user sign up |

### 💻 Local Development Links
| Destination | URL |
|---|---|
| **Frontend Local** | [http://localhost:3000](http://localhost:3000) |
| **Backend API Base** | [http://localhost:4000/api](http://localhost:4000/api) |
| **Admin Settings Hub** | [http://localhost:3000/admin/settings](http://localhost:3000/admin/settings) |
| **Subscription Plan Manager** | [http://localhost:3000/admin/subscriptions](http://localhost:3000/admin/subscriptions) |
| **Provider Assignment Engine** | [http://localhost:3000/admin/events](http://localhost:3000/admin/events) |

---

## 2. Seed Test Accounts & Login Credentials

All seed test accounts share the universal password: **`SriAnvaya@2026`**  
*(On the `/login` screen, you can also use the 1-Click Quick Demo Login buttons)*.

| Portal | Role Badge | Email | Password | Access & Capabilities |
|---|---|---|---|---|
| 👑 **Admin Portal** | `SUPER_ADMIN` | `admin@srianvaya.com` | `SriAnvaya@2026` | Full Control: 4-member dispatch, plan CRUD, multi-cloud storage, DB backups |
| 🪔 **Vedic Provider** | `PROVIDER` | `krishna.vadhyar@srianvaya.com` | `SriAnvaya@2026` | Mobile-first ritual checklist, mark arrived/completed, 12% welfare wallet |
| 👤 **Customer Portal** | `CUSTOMER` | `sundaram.sharma@example.com` | `SriAnvaya@2026` | 8-Step onboarding, Pitru vault, family tree, calendar, printable tax invoices |
| 📋 **Operations** | `OPERATIONS` | `operations@srianvaya.com` | `SriAnvaya@2026` | Ceremony tracking, provider coordination, dakshina dispatch, communications |

---

## 3. Technology Stack & Exact Versions

### A. Frontend Architecture
| Component | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | **Next.js** | `14.1.0` | React App Router, SSR, Server/Client components |
| **Library** | **React** | `18.2.0` | Component state, hooks, and lifecycle |
| **Language** | **TypeScript** | `5.3.3` | Type safety and schema validation |
| **Styling** | **TailwindCSS** | `3.4.1` | Curated Vedic heritage palette (`maroon`, `gold`, `sand`, `warmwhite`, `canvas`) |
| **Icons** | **Lucide React** | `0.344.0` | Modern SVG icons |
| **Deployment** | **Netlify** | Next.js Plugin | Continuous deployment and global edge CDN |

### B. Backend Architecture
| Component | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | **NestJS Core** | `10.3.3` | Modular enterprise backend architecture |
| **HTTP Engine** | **Express** | `4.17.21` | High-throughput REST API server |
| **Language** | **TypeScript** | `5.3.3` | Server-side typed architecture |
| **Runtime** | **Node.js** | `v20.x` / `v18.x` | Server execution runtime |
| **Authentication** | **Passport + JWT** | `10.2.0` / `0.7.0` | Stateless Bearer token security & role guards |
| **Password Hash**| **BcryptJS** | `2.4.3` | Salted SHA-512 password hashing |
| **Validation** | **Class Validator** | `0.14.1` | Automated request DTO validation pipes |
| **Deployment** | **Render** | Node Service | Cloud container hosting & auto-redeploy |

### C. Database & Multi-Cloud Infrastructure
| Service | Provider / Package | Version | Configuration / Usage |
|---|---|---|---|
| **Primary Database** | **MongoDB Atlas** | Cluster0 | Cloud MongoDB (`mongoose@8.2.0`), auto-reconnect |
| **Media & Images** | **Cloudinary** | `2.0.1` | Signed uploads for certificates and receipts (`gc2damux`) |
| **Cloud Storage 1** | **Amazon AWS S3** | REST PutObject | High-volume document vault (`sri-anvaya-vault`) |
| **Cloud Storage 2** | **Azure Blob Storage**| SAS Token API | Enterprise container vault (`pitru-records`) |
| **Payment Gateway 1**| **Razorpay SDK** | `2.9.2` | Domestic INR recurring subscriptions & dakshinas |
| **Payment Gateway 2**| **Stripe SDK** | `14.19.0` | International USD/EUR/GBP payment processing |
| **Email Gateway** | **SendGrid / SMTP** | Node Transport | Outbound ritual notifications and tithi reminders |
| **WhatsApp Hub** | **Gupshup / Twilio** | REST API | Prior 30-day/7-day/24-hour ceremony alerts |

---

*ॐ शान्तिः शान्तिः शान्तिः — Sri Anvaya Platform*
