# NYLIX

**Architectural Task Management Ecosystem**

---

## Technical Overview

Nylix is a high-performance task management platform designed for professional workflows. It integrates modern web technologies with low-code automation, prioritizing structural integrity and minimalist design. The system is built upon a scalable Node.js foundation, utilizing non-relational data modeling for maximum flexibility.

<p align="center">
  <img src="./docs/nylix_preview.png" alt="Nylix System Preview" width="100%">
</p>

## Core Architecture

### Backend Infrastructure
- **Engine:** Node.js / Express.js
- **Persistence:** MongoDB / Mongoose ODM
- **Security:** JWT (JSON Web Tokens) with HttpOnly cookie persistence
- **Encryption:** BCrypt algorithm for hash-based password storage
- **Automation:** Node-RED integration for low-code event handling and flow control

### Frontend Specification
- **Interface:** HTML5, CSS3 (Custom Glassmorphism Framework)
- **Grid System:** Bootstrap 5
- **Dynamic Entities:** jQuery for asynchronous DOM manipulation
- **Form Logic:** SurveyJS for JSON-driven dynamic form generation
- **Data Tables:** DataTables.js for high-speed indexing, searching, and pagination
- **Visualizations:** Chart.js for productivity analytics

## Key Functionalities

### 1. Intentional Task Management
Tasks are treated as "intents" with structural properties including priority vectors, temporal metadata, and category assignments. The interface uses a clean bento-style grid to minimize cognitive load.

### 2. Low-Code Automation Engine
The platform features an embedded Node-RED workspace, allowing advanced users to build custom automation bridges, third-party integrations, and automated notifications without modifying the core source code.

### 3. Identity & Security
A robust authentication gate ensures that all workspace data is isolated and secure. Session management is handled through signed tokens, providing a balance between security and user experience.

## Deployment Guide

### Prerequisites
- Node.js (v16.x or higher)
- MongoDB Instance

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nylix.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configuration:
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_connection_string
   PORT=3000
   JWT_SECRET=your_secure_secret
   ```
4. Execution:
   ```bash
   npm start
   ```

## Development Logistics

Nylix was developed as a case study in blending traditional task management with industrial-grade automation tools. The code follows a clean MVC (Model-View-Controller) pattern, ensuring that routes, logic, and data structures are strictly decoupled.

---

**Developed and Maintained by [Your Name]**  
[Your Portfolio / Contact Links]
