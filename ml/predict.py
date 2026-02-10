import sys
import joblib
import pandas as pd
import os

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_prediction():
    try:
        # 1. Load the "Brain" and the "Map"
        # Using join(BASE_DIR) ensures it works even when called from Node.js
        model = joblib.load(os.path.join(BASE_DIR, "carbon_model.pkl"))
        encoders = joblib.load(os.path.join(BASE_DIR, "label_encoders.pkl"))
        feature_order = joblib.load(os.path.join(BASE_DIR, "feature_names.pkl"))

        # 2. Capture arguments from Node.js
        # sys.argv[1:] contains everything passed from server.js
        raw_args = sys.argv[1:]

        # 3. Align raw arguments to the correct feature names
        input_data = {}
        for i, name in enumerate(feature_order):
            # Fallback to "0" if an argument is missing or undefined
            val = raw_args[i] if i < len(raw_args) else "0"
            
            if name in encoders:
                # Handle Categorical (matching the lowercase training logic)
                clean_val = str(val).lower().strip()
                try:
                    # Transform text into the number the model understands
                    input_data[name] = encoders[name].transform([clean_val])[0]
                except:
                    # If label is unknown, use the first category (usually index 0)
                    input_data[name] = 0 
            else:
                # Handle Numerical
                try:
                    input_data[name] = float(val)
                except:
                    # Safety: if Node sends text for a number field, force it to 0.0
                    input_data[name] = 0.0

        # 4. Create DataFrame in the EXACT sequence used during training
        input_df = pd.DataFrame([input_data])[feature_order]
        
        # 5. Predict and output only the number
        prediction = model.predict(input_df)
        
        # Standard output is read by Node.js resultData variable
        # We use float() and round() to ensure it's a clean number for the backend
        print(round(float(prediction[0]), 2))

    except Exception as e:
        # Standard error is read by Node.js errorData variable
        sys.stderr.write(str(e))
        sys.exit(1)

if __name__ == "__main__":
    get_prediction()