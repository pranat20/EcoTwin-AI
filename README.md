# EcoTwin AI — Carbon Footprint Prediction Platform

EcoTwin AI is an AI-powered web application that predicts a user's carbon footprint based on their lifestyle and provides a sustainability score with personalized recommendations.


---

## Developed By
**Pranat Pagar**    

---

## Key Features
• AI-based Carbon Footprint Prediction  
• Sustainability Score (0–100)  
• Personalized AI Recommendations  
• Interactive Dashboard with Charts  
• Prediction History Tracking  
• Secure Login & Authentication  

---

## Machine Learning
Algorithm used: **Random Forest Regressor**

Predicts:
• Annual Carbon Emission (kg/year)  
• Sustainability Score  

---

## Tech Stack

**Frontend:** React.js, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Machine Learning:** Python, Scikit-learn  

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

### 2️⃣ Setup Backend
cd backend
npm install

Create .env file: MONGO_URI=your_mongodb_connection_string
npm start

### 3️⃣ Setup Frontend
cd frontend
npm install
npm install lucide-react recharts axios react-router-dom
npm run dev

### 4️⃣ Setup Machine Learning
cd ml
pip install pandas scikit-learn joblib
python train_model.py


