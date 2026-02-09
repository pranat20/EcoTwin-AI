import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

# --- 1. Load Dataset ---
# Ensure your CSV is located at ml/dataset/cleaned_carbon.csv
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR, "dataset", "cleaned_carbon.csv")

if not os.path.exists(csv_path):
    print(f"ERROR: CSV not found at {csv_path}")
    exit()

data = pd.read_csv(csv_path)
print(f"Dataset loaded: {data.shape[0]} rows found.")

# --- 2. Master Feature List (The "Map") ---
# This order is CRITICAL. Every other file will follow this exact sequence.
all_features = [
    'Body Type', 'Sex', 'Diet', 'How Often Shower', 'Heating Energy Source',
    'Transport', 'Vehicle Type', 'Social Activity', 'Monthly Grocery Bill',
    'Frequency of Traveling by Air', 'Vehicle Monthly Distance Km', 
    'Waste Bag Size', 'Waste Bag Weekly Count', 'How Long TV PC Daily Hour',
    'How Many New Clothes Monthly', 'How Long Internet Daily Hour', 
    'Energy efficiency', 'Recycling', 'Cooking_With'
]

target = 'CarbonEmission'

# --- 3. Preprocessing & Encoding ---
label_encoders = {}
processed_X = pd.DataFrame()

for col in all_features:
    # Standardize data: Fill gaps, convert to string, force lowercase, trim spaces
    clean_series = data[col].fillna('0').astype(str).str.lower().str.strip()
    
    # Logic: If it contains any letters, it's Categorical (Text)
    if clean_series.str.contains('[a-z]', regex=True).any():
        le = LabelEncoder()
        processed_X[col] = le.fit_transform(clean_series)
        label_encoders[col] = le
        print(f"Encoded Text: {col}")
    else:
        # It's a number
        processed_X[col] = pd.to_numeric(clean_series, errors='coerce').fillna(0)
        print(f"Processed Number: {col}")

y = data[target]

# --- 4. Training ---
print("Training Random Forest Model...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(processed_X, y)

# --- 5. Save Artifacts ---
joblib.dump(model, os.path.join(BASE_DIR, "carbon_model.pkl"))
joblib.dump(label_encoders, os.path.join(BASE_DIR, "label_encoders.pkl"))
joblib.dump(all_features, os.path.join(BASE_DIR, "feature_names.pkl"))

print("Success! All 3 artifacts saved in the ml/ folder.")