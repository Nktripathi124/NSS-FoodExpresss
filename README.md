

NSS FoodExpresss 🍔
NSS FoodExpresss is a dynamic and secure full-stack food delivery web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This platform connects customers, restaurants, delivery partners, and administrators in a seamless and efficient ecosystem.



✨ Key Features![WhatsApp Image 2025-08-11 at 13 08 44](https://github.com/user-attachments/assets/8a911ac1-cc83-48ce-9f22-1c4e1208311d)

Multi-Role System: Separate dashboards and functionalities for four distinct roles:

Admin: Oversees the entire platform.

Customer: Browses restaurants, places orders, and tracks delivery.

Restaurant Partner: Manages menu, accepts orders, and tracks earnings.

Delivery Partner: Views and accepts delivery tasks.

Secure Authentication: Implements JSON Web Tokens (JWT) for secure, role-based user login and persistent session management.
![WhatsApp Image 2025-08-11 at 13 08 44 (1)](https://github.com/user-attachments/assets/48c0ccea-d175-40e6-8d59-ff60918f7b18)

Full CRUD Functionality: Complete Create, Read, Update, and Delete operations for managing users, restaurants, menu items, orders, and delivery records.
![WhatsApp Image 2025-08-11 at 19 06 03](https://github.com/user-attachments/assets/84c8360c-c81a-4a5e-9b5f-51156667d02f)

Responsive User Interface: A clean, intuitive, and mobile-friendly UI built with React ensures a great user experience across all devices.
![WhatsApp Image 2025-08-11 at 19 06 22](https://github.com/user-attachments/assets/694300b4-e3fb-4cef-9986-2afcef925747)

Integrated Helpdesk: A dedicated module for users to raise queries and for admins to resolve them, ensuring excellent customer support.

Real-time Order Tracking: (Optional: If you have this feature, mention it here). Customers can track the status of their orders from placement to delivery.

🛠️ Tech Stack
Frontend: React.js, CSS3

Backend: Node.js, Express.js

Database: MongoDB

Authentication: JSON Web Tokens (JWT), bcrypt.js

Version Control: Git & GitHub

🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
You need to have Node.js and npm installed on your machine.

Node.js (which includes npm)

MongoDB (or a MongoDB Atlas account)

Installation
Clone the repository:

Bash

git clone https://github.com/Nktripathi124/NSS-FoodExpresss.git
cd NSS-FoodExpresss
Install Backend Dependencies:

Bash

# Navigate to the server directory
cd server
npm install
Install Frontend Dependencies:

Bash

# Navigate to the client directory from the root
cd ../client
npm install
Set up Environment Variables:
Create a .env file in the server directory and add the following variables. Replace the placeholder values with your actual data.

Code snippet

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
Run the Application:

Start the Backend Server: From the server directory, run:

Bash

npm start
Start the Frontend Client: From the client directory, run:

Bash

npm start
The application should now be running on http://localhost:3000.

Folder Structure
/
├── client/         # React Frontend
│   ├── public/
│   └── src/
└── server/         # Node.js & Express Backend
    ├── controllers/
    ├── models/
    ├── routes/
    └── index.js
🤝 How to Contribute
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

