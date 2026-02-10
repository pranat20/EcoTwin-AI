import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split # Added for splitting
from sklearn.metrics import r2_score, mean_absolute_error # Added for accuracy
import joblib
import os

# --- 1. Load Dataset ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR, "dataset", "cleaned_carbon.csv")

if not os.path.exists(csv_path):
    print(f"ERROR: CSV not found at {csv_path}")
    exit()

data = pd.read_csv(csv_path)
print(f"Dataset loaded: {data.shape[0]} rows found.")

# --- 2. Master Feature List ---
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
    clean_series = data[col].fillna('0').astype(str).str.lower().str.strip()
    
    if clean_series.str.contains('[a-z]', regex=True).any():
        le = LabelEncoder()
        processed_X[col] = le.fit_transform(clean_series)
        label_encoders[col] = le
    else:
        processed_X[col] = pd.to_numeric(clean_series, errors='coerce').fillna(0)

y = data[target]

# --- 4. X Split & Y Split ---
# test_size=0.2 means 80% data for training, 20% for testing accuracy
X_train, X_test, y_train, y_test = train_test_split(processed_X, y, test_size=0.2, random_state=42)

print(f"Training on: {X_train.shape[0]} rows")
print(f"Testing on: {X_test.shape[0]} rows")

# --- 5. Training ---
print("Training Random Forest Model...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# --- 6. Accuracy Evaluation ---
predictions = model.predict(X_test)

# R2 Score (1.0 is perfect accuracy)
accuracy = r2_score(y_test, predictions) * 100
# MAE (Average error in kg)
mae = mean_absolute_error(y_test, predictions)

print("-" * 30)
print(f"MODEL ACCURACY (R2): {accuracy:.2f}%")
print(f"AVERAGE ERROR (MAE): {mae:.2f} kg")
print("-" * 30)

# --- 7. Save Artifacts ---
joblib.dump(model, os.path.join(BASE_DIR, "carbon_model.pkl"))
joblib.dump(label_encoders, os.path.join(BASE_DIR, "label_encoders.pkl"))
joblib.dump(all_features, os.path.join(BASE_DIR, "feature_names.pkl"))

print("Success! All artifacts saved.")