# Portfolio v2

A premium, cinematic personal portfolio with a dedicated CMS for content management. Built with a modern tech stack focused on performance, aesthetics, and ease of use.

## 🚀 Overview

This project is a monorepo containing three main modules:

- **Frontend**: A cinematic and minimal portfolio website.
- **CMS Frontend**: A robust admin panel for managing portfolio content.
- **Backend**: A flexible API powered by Node.js, Express, and MongoDB, with Supabase integration for media storage.

---

## 🛠 Tech Stack

### Frontend (Portfolio)

- **Framework:** React + Vite
- **Styling:** Tailwind CSS + Custom CSS Variables
- **Animations:** Framer Motion (Cinematic motion philosophy)
- **Icons:** Lucide React + Simple Icons
- **Scrolling:** Lenis Smooth Scrolling

### CMS Frontend (Admin Panel)

- **Framework:** React + Vite
- **UI Components:** Radix UI + Custom components
- **Styling:** Tailwind CSS
- **Interactions:** @dnd-kit (Drag & Drop image reordering)
- **Management:** SWR for data fetching & state synchronization

### Backend (API)

- **Server:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Cloud Storage:** Supabase Storage (for images and assets)
- **Authentication:** JWT (JSON Web Tokens) + Bcryptjs
- **Media Handling:** Multer + Supabase integration

---

## ✨ Features

### Portfolio (Public)

- **Cinematic Experience:** Soft fade-ins, gold glow effects, and smooth parallax.
- **Dynamic Themes:** Toggle between "Cinematic Dark" and "Minimal Light" modes.
- **Responsive Design:** Optimized for all screen sizes.
- **Content Sections:** Hero, About, Skills, Projects, Blogs, Experience, Testimonials, and Contact.

### CMS (Admin Only)

- **Dashboard:** At-a-glance view of portfolio statistics.
- **Content Management:** Full CRUD operations for all portfolio sections.
- **Advanced Gallery Manager:** Drag-and-drop reordering for project images.
- **Blog Editor:** Support for Markdown with real-time preview.
- **Media Uploads:** Seamless integration with Supabase for cloud-based asset storage.

---

## 📁 Project Structure

```text
portfolio-v2/
├── frontend/           # Portfolio UI (React + Vite)
├── backend/            # API & Business Logic (Express + Node)
├── cms-frontend/       # Admin Control Panel (React + Vite)
├── master_plan.md      # Architectural roadmap
└── README.md           # Project documentation
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- Supabase Account (for storage)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/portfolio-v2.git
   cd portfolio-v2
   ```

2. **Setup Backend:**

   ```bash
   cd backend
   npm install
   # Create .env file based on example
   npm run dev
   ```

3. **Setup Frontend:**

   ```bash
   cd ../frontend
   npm install
   # Create .env file
   npm run dev
   ```

4. **Setup CMS Frontend:**
   ```bash
   cd ../cms-frontend
   npm install
   # Create .env file
   npm run dev
   ```

---

## 🔐 Environment Variables

Ensure you have the following variables in your `.env` files:

### Backend

- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase service role key
- `JWT_SECRET`: Secret for token signing
- `FRONTEND_URL`: URL of the public portfolio
- `CMS_URL`: URL of the CMS panel

### Frontend & CMS

- `VITE_API_URL`: Backend API base URL (e.g., http://localhost:5000/api)
