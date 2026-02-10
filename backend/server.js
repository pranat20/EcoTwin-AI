const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { spawn } = require("child_process");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Models
const UserPrediction = require("./models/UserPrediction");
const AuthUser = require("./models/AuthUser");

const app = express();

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        // This allows any origin that isn't null
        if (!origin) return callback(null, true);
        return callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "ecotwin_secret_key";
const PYTHON_CMD = process.platform === "win32" ? "python" : "python3";

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("EcoTwin Intelligence Connected Successfully"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// --- AI Recommendation Logic ---
const generateRecommendations = (prediction, data) => {
    let tips = [];
    
    // Overall Footprint Logic
    if (prediction > 3000) {
        tips.push("Your footprint is quite high. Focus on reducing private vehicle usage and optimizing home heating.");
    } else if (prediction > 1500) {
        tips.push("You're doing well! Transitioning to energy-efficient appliances could further lower your score.");
    } else {
        tips.push("Outstanding! Your lifestyle is highly sustainable. Share your habits with others!");
    }
    
    // Transport Logic (Safely checking categorical values)
    if (String(data.transport).toLowerCase() === "private") {
        tips.push("Consider carpooling or switching to public transport to save CO2.");
    }

    // Diet Logic
    if (String(data.diet).toLowerCase() === "omnivore") {
        tips.push("Switching to plant-based meals just 3 times a week can reduce your food emissions by 25%.");
    }

    // Waste/Recycling Logic
    if (String(data.recycling).toLowerCase() !== "yes") {
        tips.push("Improving your recycling consistency for paper and plastic can significantly reduce landfill waste.");
    }

    return tips.length > 0 ? tips : ["Continue monitoring your daily energy consumption to find more savings."];
};

// --- ROUTES ---

// 1. Signup Route
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await AuthUser.findOne({ email });
        if (existingUser) return res.json({ success: false, message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new AuthUser({ name, email, password: hashedPassword });
        await newUser.save();

        res.json({ success: true, message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// 2. Login Route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await AuthUser.findOne({ email });
        if (!user) return res.json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: "Invalid password" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// 3. Updated Prediction Route (Synced with Feature Map)
app.post("/predict", async (req, res) => {
    try {
        const data = req.body;
        const { userId } = data;

        pythonPath = path.join(__dirname, "..", "ml", "predict.py");

        // ARGUMENT ORDER MUST MATCH THE 19 FEATURES IN train_model.py
        const args = [
            pythonPath,
            data.bodyType || "normal",
            data.sex || "female",
            data.diet || "omnivore",
            data.showerFrequency || "daily",
            data.heatingSource || "electricity",
            data.transport || "public",
            data.vehicleType || "none",
            data.socialActivity || "sometimes",
            data.groceryBill || 0,
            data.airTravel || "rarely",
            data.vehicleDistance || 0,
            data.wasteBagSize || "medium",
            data.wasteCount || 0,
            data.tvHours || 0,
            data.newClothes || 0,
            data.internetHours || 2,
            data.energyEfficiency || "sometimes",
            data.recycling || "sometimes",
            data.cookingWith || "gas"
        ];

        // Change "python" to "python3" if you are on Linux/Mac
        const pythonProcess = spawn("python", args);

        let resultData = "";
        let errorData = "";

        pythonProcess.stdout.on("data", (d) => { resultData += d.toString(); });
        pythonProcess.stderr.on("data", (d) => { errorData += d.toString(); });

        pythonProcess.on("close", async (code) => {
            if (code !== 0) {
                console.error("ML Error:", errorData);
                return res.status(500).json({ success: false, message: "ML Engine Error" });
            }

            const prediction = parseFloat(resultData.trim());
            
            // Calculate Score: 100 is perfect, 0 is poor (Scaling based on avg data)
            // Dataset-based normalization
const MIN = 500;
const MAX = 5000;

let score = 100 - ((prediction - MIN) / (MAX - MIN)) * 100;

if (score > 100) score = 100;
if (score < 0) score = 0;

score = Math.round(score);

            const recommendations = generateRecommendations(prediction, data);

            // Save the detailed record to MongoDB
            const newPrediction = new UserPrediction({
                userId,
                bodyType: data.bodyType,
                sex: data.sex,
                diet: data.diet,
                predictedCarbonEmission: prediction,
                sustainabilityScore: score,
                recommendations: recommendations
            });

            await newPrediction.save();

            // Breakdown calculation (based on dataset feature weights approximation)

// Breakdown calculation (based on dataset feature weights approximation)
const breakdown = {

    transport: Math.round(prediction * 0.32),
    energy: Math.round(prediction * 0.28),
    diet: Math.round(prediction * 0.18),
    waste: Math.round(prediction * 0.12),
    lifestyle: Math.round(prediction * 0.10)

};


// =============================
// NEW FEATURE 1: INDIA vs GLOBAL COMPARISON
// =============================

const INDIA_AVG = 1900;
const GLOBAL_AVG = 4600;

const comparison = {

    indiaAverage: INDIA_AVG,
    globalAverage: GLOBAL_AVG,

    vsIndiaPercent: Math.round(((prediction - INDIA_AVG) / INDIA_AVG) * 100),

    vsGlobalPercent: Math.round(((prediction - GLOBAL_AVG) / GLOBAL_AVG) * 100),

    betterThanIndia: prediction < INDIA_AVG,
    betterThanGlobal: prediction < GLOBAL_AVG

};


// =============================
// NEW FEATURE 2: SUSTAINABILITY BADGE
// =============================

let badge = "";

if(score >= 80)
    badge = "Eco Champion";

else if(score >= 60)
    badge = "Eco Conscious";

else
    badge = "Eco Beginner";


// =============================
// NEW FEATURE 3: FUTURE PREDICTION (5 YEARS)
// =============================

const futurePrediction = [

    { year: 2026, emission: Math.round(prediction) },

    { year: 2027, emission: Math.round(prediction * 1.03) },

    { year: 2028, emission: Math.round(prediction * 1.06) },

    { year: 2029, emission: Math.round(prediction * 1.09) },

    { year: 2030, emission: Math.round(prediction * 1.12) }

];


// FINAL RESPONSE
res.json({

    success: true,

    prediction: prediction,

    score: score,

    recommendations: recommendations,

    breakdown: breakdown,

    comparison: comparison,

    badge: badge,

    futurePrediction: futurePrediction

});


        });
    } catch (error) {
        console.error("Predict Error:", error);
        res.status(500).json({ success: false });
    }
});

// 4. History Route
app.get("/history/:userId", async (req, res) => {
    try {
        const predictions = await UserPrediction.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json({ success: true, predictions });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 EcoTwin Server running on http://localhost:${PORT}`));