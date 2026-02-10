const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
    userId: { type: String, required: true }, 
    bodyType: String,
    sex: String,
    diet: String,
    predictedCarbonEmission: Number,
    sustainabilityScore: Number, 
    modelAccuracy: Number, 
    recommendations: [String], 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserPrediction", predictionSchema);