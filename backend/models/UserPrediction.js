const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
    // Standardized to accept both ObjectId and String for flexibility with your Auth logic
    userId: { type: String, required: true }, 
    bodyType: String,
    sex: String,
    diet: String,
    predictedCarbonEmission: Number,
    sustainabilityScore: Number, 
    modelAccuracy: Number, // Stores the dynamic AI confidence score
    recommendations: [String], 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserPrediction", predictionSchema);