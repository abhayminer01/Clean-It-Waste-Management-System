# 🧹 Clean-It : Waste Management System  

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
```yaml
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
```

---

## 🚀 Getting Started  

### 🔹 Prerequisites  
Make sure you have installed:  
- [Node.js](https://nodejs.org/) >= 18  
- [MongoDB](https://www.mongodb.com/) (local or Atlas)  
- npm / yarn  

---

### 🔹 Clone the Repository  

```bash
git clone https://github.com/<your-username>/clean-it.git
cd clean-it
```

### 🔹 Install Dependencies
Backend :
```bash
cd server
npm install
```
Frontend :
```bash
cd client
npm install
```

### 🔹 Environment Variables
Create a `.env` file inside `/server` with:
```ini
MONGO_URI=<your-mongodb-uri>
SESSION_SECRET=<your-secret-key>
PORT=5000
```

### 🔹 Run the App
Backend :
```bash
cd server
npm run dev
```
Frontend :
```bash
cd client
npm run dev
```

The app should now be running at:

- Frontend → http://localhost:3000

- Backend API → http://localhost:5000


## 🤝 Contributing
Contributions are welcome! Please fork the repo and submit a pull request. Follow contribution guidelines.

## 📜 License
This project is liceneced by `Abhay V`. Using this idea without concent is punishable offence under copyright rules. Code is licenced under MIT. Free to use and modify