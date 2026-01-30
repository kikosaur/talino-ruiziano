# Talino-Ruiziano Learning Platform 📚✨

Talino-Ruiziano is a modern, gamified learning management system designed to make independent learning engaging and tracking effortless. It bridges the gap between students and teachers with real-time tools, progress tracking, and interactive elements.

## 🚀 Key Features

### For Students:
*   **Gamified Dashboard:** Earn XP, badges, and level up by completing tasks.
*   **Mission Control:** View and submit **Independent Learning Tasks (ILTs)** with drag-and-drop ease.
*   **Study Aids:** Built-in **Lo-fi Music Player** and **Timer** to boost focus.
*   **Social Learning:** Chat with peers (Global/Private) and see who's online.
*   **Personalization:** Choose from 36+ unique avatars (People, Robots, Emoji).
*   **Progress Tracking:** Visual graphs of points, streaks, and session time.

### For Teachers (Admins):
*   **Class Overview:** Monitor all student submissions and progress in real-time.
*   **Analytics:** Track student engagement, session times, and activity levels.
*   **Communication:** Direct messaging with students for support.
*   **Content Management:** Create and manage ILTs and deadlines easily.

### Technical Highlights:
*   **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop.
*   **Real-time:** Instant chat and notifications via Supabase Realtime.
*   **Security:** Role-based access control (RLS) protects user data.

## 🛠️ Tech Stack

*   **Frontend:** React (Vite), TypeScript, Tailwind CSS
*   **UI Components:** shadcn/ui, Lucide Icons
*   **Backend & Auth:** Supabase (PostgreSQL)
*   **State Management:** React Query
*   **Charts:** Recharts
*   **Forms:** React Hook Form + Zod

## 💻 System Requirements

*   **Node.js:** v16.0.0 or higher
*   **npm:** v7.0.0 or higher
*   **Browser:** Modern browser (Chrome, Edge, Firefox, Safari)

## ⚡ Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/study-spark.git
    cd study-spark
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

5.  **Open in Browser:**
    Navigate to `http://localhost:8080` (or the port shown in your terminal).

## 🏆 Badges System & Automation
The platform features an automated badge awarding system governed by database triggers. Ensure you run the `supabase/badge_automation_setup.sql` script in your Supabase SQL Editor to enable:
*   **Early Bird:** Submit 3 days early.
*   **On Fire:** 7-day login streak.
*   **Scholar:** Reach 1000 points.

---
*Built with ❤️ for Talino-Ruiziano.*
