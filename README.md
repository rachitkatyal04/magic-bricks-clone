# 🏠 MagicBricks Clone

A full-featured real estate property listing web application built with **Next.js** and **Supabase**. It allows users to browse, filter, and explore properties, with a dedicated admin dashboard for property management.

MagicBricks Clone Preview:  
![MagicBricks Preview](magic-bricks-clone.vercel.app) <!-- Replace this with your actual image URL -->

---

## ✨ Features
- 🔍 Property browsing with advanced filtering
- 🧑‍💼 Admin dashboard to manage listings
- 🔐 Supabase authentication for secure access
- ⚡ Responsive UI built with Tailwind CSS
- 🛠️ Easy database setup with sample data
- 🧩 Modular and clean code structure

---

## 🚀 Technologies Used
- **Next.js** – React framework
- **Tailwind CSS** – Utility-first styling
- **Supabase** – Auth + Database
- **shadcn/ui** – UI components
- **TypeScript** – Type safety

---

## 🗂️ Project Structure
- `app/` – Application routes and pages
- `components/` – Reusable UI components
- `lib/` – Utilities and configuration
- `public/` – Static assets (images, etc.)
- `styles/` – Tailwind and global styles

---

## 🧑‍💻 Local Development

To run this project on your local machine:

```bash
# 1. Clone the repository
git clone https://github.com/rachitkatyal04/magicbricks-clone.git

# 2. Navigate to the project directory
cd magicbricks-clone

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env.local
# Fill in your Supabase project URL and anon/public key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


# 5. Run the development server
npm run dev
