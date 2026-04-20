# Notes App 📝

A minimalist, responsive, and robust note-taking application built with modern web technologies. This project provides a complete environment for managing ideas, journals, and technical notes with a seamless user experience across both desktop and mobile devices.

## 🚀 Features

- **Multi-User Authentication**: Secure sign-up, login, and password recovery via Supabase Auth.
- **Notebook Organization**: Group entries into distinct notebooks (e.g., Ideas, Work, Journal).
- **Journal Mode**: Dedicated notebook mode tailored for chronological entries.
- **Tagging System**: Add distinct tags to your entries with live previews for easy skimming.
- **Smart Search & Filters**: Instantly find notes by title, content, tags, or recency.
- **Real-Time Auto-Save**: Optimistic UI updates with debounced persistence to Supabase.
- **Mobile First UX**: 
  - Dynamic responsive layout (Drawer behavior for sidebars).
  - Gestural UX for navigating in and out of the editor.
  - Large touch targets and smart layouts.
- **Dark/Light Mode**: Full theme customization built deep within the Tailwind config.

## 🛠 Tech Stack

- **Frontend:** [React](https://react.dev/), [Next.js (App Router)](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **Typography:** [Roboto Variable Font](https://fonts.google.com/specimen/Roboto)
- **Backend/DB:** [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security)
- **State Management:** Custom React Hooks + Context Reducers.

## 📦 Getting Started

### 1. Prerequisites
- Node.js (v18.x or newer)
- [pnpm](https://pnpm.io/) package manager
- A local or remote Supabase project.

### 2. Installation

Clone the repository and install the dependencies:
```bash
git clone https://github.com/your-username/notesapp.git
cd notesapp
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root of the project and populate it with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Database Setup

Execute the provided SQL schema in your Supabase SQL Editor to construct the tables and enable Row-Level Security (RLS). You can find the database setup breakdown within your development tools or apply the equivalent structure for:
- `notebooks`
- `entries`
- `tags`
- `entry_tags`

### 5. Running the Application

Start the development server:

```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 Mobile Architecture
This app isn't just responsive; it shifts components dynamically. On phones, the side-panel architecture collapses into single-focus views relying on slide-out drawers and native backward navigation for unparalleled phone comfort.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
