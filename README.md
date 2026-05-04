# Premium Quran Web Application (Frontend)

The frontend for a high-fidelity Quran study application built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**.

## Live Demo
- **Frontend**: [https://quranmajid.vercel.app/en](https://quranmajid.vercel.app/en)

---

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API + TanStack Query
- **Internationalization**: `next-intl`
- **UI Components**: Shadcn UI / Radix UI

---

## Key Features
- **Surah Sidebar**: Navigate through all 114 Surahs with metadata.
- **Madani Mushaf Pages**: Full 604-page navigation support.
- **Juz Navigation**: Direct access to all 30 Juz.
- **Premium Reading Experience**: Multiple Quranic fonts, adjustable font sizes.
- **Smooth Audio Player**: 60fps frame-synced progress tracking.
- **Local Persistence**: User preferences and bookmarks persist via `localStorage`.

---

##  Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```
