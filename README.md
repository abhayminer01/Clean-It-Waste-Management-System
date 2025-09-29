# 🧹 Clean-It – Smart Waste Management System  

A full-stack MERN application designed to promote **eco-friendly waste management** for both **household** and **industrial users**.  
The system allows users to schedule waste pickups, rewards them with coins for proper disposal, and enables **Eco Agents** to manage and process pickups in real time.  

---

## ✨ Features  

### 👨‍👩‍👧 Household Users  
- Register/login securely  
- Schedule waste pickups (date & time slot)  
- Earn **coins** based on waste type & disposal manners  
- Manage & update pickup history  

### 🏭 Industrial Users  
- Register with license verification  
- Schedule industrial pickups  
- Manage industry profile (name, contact, location, etc.)  
- View/update pickup history  

### ♻️ Eco Agents  
- Secure login  
- View **only assigned pickups** (`pickup.agent === agent`)  
- Mark pickups as **Completed / Pending**  
- Access pickup history & user details  

### 👨‍💻 Admin  
- Manage users (household, industrial, eco agents)  
- Monitor pickups & rewards system  
- Analytics dashboard (future enhancement 🚀)  

---

## 🛠️ Tech Stack  

- **Frontend**: React.js (with TailwindCSS + Context API)  
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB (Mongoose ODM)  
- **Authentication**: Session-based auth (express-session + bcrypt)  
- **Real-time Updates**: Socket.io (for live chat / pickup updates – WIP)  

---

## 📂 Project Structure  
`yaml
│── client/ # React frontend
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # User, Industry, Agent dashboards
│ │ ├── services/ # API calls (Axios)
│ │ └── context/ # React Context for state management
│
│── server/ # Express backend
│ ├── controllers/ # Business logic (pickup, user, industry, agent)
│ ├── models/ # MongoDB schemas
│ ├── middlewares/ # Auth & validation
│ ├── routes/ # API endpoints
│ └── server.js # Entry point
│
│── package.json
│── README.md
`