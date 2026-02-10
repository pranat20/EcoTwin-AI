const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "AuthUser" },
    bodyType: String,
    sex: String,
    diet: String,
    predictedCarbonEmission: Number,
    sustainabilityScore: Number, // New Field
    modelAccuracy: Number, // New Field
    recommendations: [String],   // New Field
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserPrediction", predictionSchema);