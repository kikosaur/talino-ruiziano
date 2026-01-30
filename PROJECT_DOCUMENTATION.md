# Talino-Ruiziano (Study Spark) - Project Documentation

Welcome to **Talino-Ruiziano**, a modern Learning Management System (LMS) and student engagement platform! This document is designed to help you understand how this web application works, what technologies it uses, and the key features it offers.

---

## 1. Project Overview

**Talino-Ruiziano** is a web application designed to help students track their learning progress (ILTs - Independent Learning Time), stay motivated through gamification, and communicate with peers and teachers. It also provides teachers with a powerful dashboard to manage the class.

**Key Goals:**
*   **Gamification:** Make learning fun with points, levels, badges, and streaks.
*   **Communication:** Enable real-time chat between students and with teachers.
*   **Productivity:** Provide tools like a Music Player and Todo List to help students focus.
*   **Management:** Streamline the submission and grading process for teachers.

---

## 2. Technology Stack (The Tools We Used)

This project uses a modern set of technologies often called the "Tech Stack". Here is a breakdown of what each tool does:

### Frontend (What you see)
*   **React:** A JavaScript library for building user interfaces. It lets us build the website using reusable "components" (like Lego blocks).
*   **TypeScript:** A "smart" version of JavaScript that helps catch errors early by defining "types" (e.g., telling the code "this variable must be a number").
*   **Tailwind CSS:** A utility-first CSS framework for styling. Instead of writing long CSS files, we use class names like `text-red-500` or `p-4` to style elements instantly.
*   **Shadcn/UI & Lucide React:** A detailed library of pre-built components (buttons, cards, inputs) and beautiful icons.

### Backend (The Brains & Database)
*   **Supabase:** An open-source alternative to Firebase. It handles:
    *   **Database:** Stores all data (users, messages, songs, submissions).
    *   **Authentication:** Handles log in, sign up, and password protection.
    *   **Real-time:** Allows features like Chat to update instantly without refreshing the page.
    *   **Storage:** Saves files like uploaded images or submission documents.

### Tools
*   **Vite:** A build tool that makes the website run extremely fast during development.
*   **Git:** A version control system to track changes to the code.

---

## 3. Key Features

### 🎓 For Students

#### **1. Student Dashboard**
*   **Overview:** See your current level, total points, and daily streak immediately.
*   **Navigation:** Easy access to all tools via a collapsible sidebar.

#### **2. Peer Chat (Real-time Messaging)**
*   **Directory View:** A "Messenger-style" home screen showing the Global Chat and a searchable list of classmates and teachers.
*   **Global Chat:** A public room where everyone in the class can talk.
*   **Private Chat:** Direct messaging with other students or the teacher.
*   **Notifications:** "Toast" popups appear when you receive a message, even if the chat is minimized.
*   **Unread Badges:** A red counter shows how many messages you missed.

#### **3. Music Player (Study Tunes)**
*   **Floating Player:** Listen to music while you browse other pages.
*   **Controls:** Play, pause, skip, seek, shuffle, and loop (All, One, None).
*   **Library:** Browse a collection of songs added by the teacher.
*   **Playlists:** Create your own "Favorites" list.
*   **Smart Features:** Auto-plays the next track and remembers your settings.

#### **4. ILT Submissions**
*   **Upload:** Submit your Independent Learning Time work directly through the app.
*   **Tracking:** See the status of your submissions (Pending, Graded).

#### **5. Gamification**
*   **Badges:** Earn badges for achievements like "7 Day Streak" or "First Submission".
*   **Levels:** Gain XP (Experience Points) to level up your profile.

---

### 🛡️ For Teachers (Admin Panel)

#### **1. Teacher Dashboard**
*   **Stats at a Glance:** See total submissions, active students, and pending grading tasks.
*   **Analytics:** detailed charts showing when students are most active.

#### **2. Student Directory**
*   **Management:** View a list of all students.
*   **Profile View:** Click a student to see their detailed stats, earned badges, and submission history.
*   **Direct Message:** Start a private chat with a student directly from their profile.

#### **3. Music Management**
*   **Upload:** Add new songs to the school library for everyone to hear.
*   **Preview:** Listen to tracks before taking them live.
*   **Delete:** Remove outdated or incorrect songs.

#### **4. Grading System**
*   **Review:** Read student submissions.
*   **Grade:** Assign points and feedback.
*   **Status Update:** Mark work as "Reviewed" or "Graded".

---

## 4. Web Development Glossary (Terms to Know)

Here are some common terms you might see in the code:

*   **API (Application Programming Interface):** A bridge that allows the Frontend (React) to talk to the Backend (Supabase).
*   **Component:** A reusable piece of code that renders a part of the UI (e.g., `Button.tsx`, `ChatBox.tsx`).
*   **Props:** Short for "properties". Data passed from a parent component to a child component (like passing parameters to a function).
*   **State:** Data that changes over time within a component. When state changes, React updates the screen automatically (e.g., `const [isOpen, setIsOpen] = useState(false)`).
*   **Hook:** Special functions in React that start with `use` (e.g., `useEffect`, `useState`). They let you "hook into" React features.
*   **Query/Mutation:**
    *   **Query:** Asking for data (e.g., "Get all messages").
    *   **Mutation:** Changing data (e.g., "Send a new message").
*   **Responsive Design:** Making sure the website looks good on both computers and mobile phones.

---

## 5. How to Run the Project

1.  **Install Node.js:** You need this to run JavaScript outside the browser.
2.  **Open Terminal:** Navigate to the project folder.
3.  **Install Dependencies:** Run `npm install` (this downloads all the libraries we use).
4.  **Start the Server:** Run `npm run dev`.
5.  **View:** Open the link shown (usually `http://localhost:8080`) in your browser.

---

**Good luck with your project! Remember, every great developer started by reading code and asking "How does this work?"**
