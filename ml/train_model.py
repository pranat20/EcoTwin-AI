import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error
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
    'Body Type', 'Sex', 'Diet', 'How Often Shower', 'How Long TV PC Daily Hour',
    'Waste Bag Size', 'How Many New Clothes Monthly', 'How Long Internet Daily Hour',
    'Energy efficiency', 'Recycling', 'Cooking_With', 'Heating Energy Source',
    'Transport', 'Vehicle Type', 'Social Activity', 'Monthly Grocery Bill',
    'Frequency of Traveling by Air', 'Vehicle Monthly Distance Km', 'Waste Bag Weekly Count'
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
X_train, X_test, y_train, y_test = train_test_split(processed_X, y, test_size=0.2, random_state=42)

# --- 5. Training ---
print("Training Random Forest Model...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# --- 6. Accuracy Evaluation ---
predictions = model.predict(X_test)
accuracy = r2_score(y_test, predictions) * 100
mae = mean_absolute_error(y_test, predictions)

print("\n" + "="*40)
print(f"🚀 MODEL PERFORMANCE REPORT")
print("="*40)
print(f"✅ R2 ACCURACY SCORE: {accuracy:.2f}%")
print(f"📊 MEAN ABSOLUTE ERROR: {mae:.2f} kg")
print("="*40)

# --- 7. Feature Importance (The "Why" Behind the AI) ---
print("\n🔥 TOP IMPACT FACTORS:")
importances = pd.Series(model.feature_importances_, index=all_features)
print(importances.sort_values(ascending=False).head(5))

# --- 8. Save Artifacts ---
joblib.dump(model, os.path.join(BASE_DIR, "carbon_model.pkl"))
joblib.dump(label_encoders, os.path.join(BASE_DIR, "label_encoders.pkl"))
joblib.dump(all_features, os.path.join(BASE_DIR, "feature_names.pkl"))

print("\n✨ All artifacts saved successfully in the ml/ folder.")