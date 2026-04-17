# AMD Cocoa Sarl

A premium, full-stack, bilingual (English & French) E-Commerce Web Application specifically tailored for high-end cocoa products directly from Cameroon. Handcrafted for B2C & B2B interactions, integrating modern front-end architectures with a robust SQLite-backed Node backend.

## Features

- **Full Bilingual Capabilities**: Built entirely with dynamic localized Context API arrays offering English & French universally across all interfaces.
- **Role-Based Workflows**: Includes isolated endpoints for Customers, individual Sellers, and high-level Administrators.
- **Robust Prisma Backend**: Integrated SQLite database tracking products, categorized assets, user security tokens, and dynamic chatbot logs.
- **NextAuth Integration**: Modern session tracking leveraging bcrypt password hashing alongside 2-Factor Email Authentication workflows.
- **Professional Logistical Maps**: Highly detailed static directories establishing international freight matrices & fair trade partner alignments.
- **Floating Intelligent Nav Widgets**: Natively bundled with a contextual ChatBot and a secure end-to-end encrypted WhatsApp ordering forwarder.

## How to Navigate

### Customers (Public Route)
- **Home**: Access premium cocoa spotlights, brand storytelling, and interactive bestsellers grids.
- **Catalogue**: Browse the entire database dynamically with real-time text/category filtering hooks.
- **Cart/Checkout**: Manage granular item capacities automatically factoring shipping logics before converting securely over WhatsApp.
- **Information**: Navigate beautifully rendered `About Us`, `Shipping`, and `FAQ` pages for logistical transparency.

### Vendors / Sellers (Private Route)
- **Registration**: Sign up actively selecting 'Vendor/Seller'. Accounts initialize in a locked state securely pending Admin overrides.
- **Seller Dashboard (`/seller`)**: Upon validation, sellers manage their dedicated inventories. The interface provides unified CRUD capabilities (Add, Edit, View, Delete) identically mimicking standard catalog parameters.
- **Settings**: Safely map independent store configurations natively.

### Administrators (Private Route)
- **Admin Dashboard (`/admin`)**: Fully locked-down workspace. Admins have omnipotent oversight across global Catalog inventories, managing external Contacts, verifying Sellers, overriding product tags, and handling Chatbot matrices.
- **Chatbot Settings (`/admin/chatbot`)**: Audit unmatched user queries recorded dynamically by the frontend bot interface to refine subsequent replies.
- **Account Tuning (`/admin/settings`)**: Securely execute high-tier credential rotations forcing strict session terminations across active tokens.

## Setup Instructions
1. Run `npm install` to hydrate all dependencies natively.
2. Initialize your database structures using `npx prisma db push`.
3. Feed the `.env` directory utilizing the identical mapping provided below:
   - `NEXTAUTH_SECRET`
   - `SMTP_USER` / `SMTP_HOST` / `SMTP_PASS` 
4. Trigger the server via `npm run dev`. Navigate out to `http://localhost:3000` to execute testing locally.
