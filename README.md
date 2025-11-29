♻️ SWMIS — Solid Waste Management Information System

A modern web application for efficient solid waste management.

<p align="center"> <img src="https://img.shields.io/badge/Laravel-11-red?style=for-the-badge" /> <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge" /> <img src="https://img.shields.io/badge/Inertia.js-💨-purple?style=for-the-badge" /> <img src="https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge" /> </p>
🌍 Overview

SWMIS is a comprehensive platform designed to streamline solid waste management using digital tools.
It integrates role-based dashboards, real-time tracking, resident communication, and administrative controls to optimize waste collection operations.

Built using Laravel + Inertia + React, it delivers a fast, modern, SPA-like user experience.

✨ Core Features
🔐 User & Role Management

Role-Based Authentication (Resident, Admin, Driver)

Auto-redirect based on user role

Admin management of users

Middleware protection for secured routes

📱 Communication

SMS Integration — notify verified residents about schedule and collection routes

In-app Notifications — alerts for complaints, verification updates, and schedule changes

🛠️ Modules by Role
🧑‍💼 Admin

📊 Admin Dashboard

👥 Manage Users

🗺️ Manage Districts & Puroks

🛣️ Manage Station Routes

📅 Manage Schedule Routes

🚛 Manage Collection Schedules

📝 Manage Complaints

✔️ Manage Resident Verification

🚮 Waste Tracker Viewer

👤 Profile Management

🏠 Resident

📊 Resident Dashboard

📝 Submit Complaints

🪪 Submit Resident Verification

📅 View Schedules

🚮 Track Waste Collection

👤 Profile

🚛 Driver

📊 Driver Dashboard

📝 Manage Complaints

🚮 Manage Waste Tracker

📅 View Collection Schedules

👤 Profile

🧱 Tech Stack
Layer	Technology
Backend	Laravel
Frontend	React (Inertia.js)
UI	TailwindCSS / shadcn
Database	MySQL / MariaDB
Notifications	SMS API + Laravel Notifications
Authentication	Laravel Breeze / Sanctum
