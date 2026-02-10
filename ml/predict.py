import sys
import joblib
import pandas as pd
import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_prediction():
    try:
        
        model = joblib.load(os.path.join(BASE_DIR, "carbon_model.pkl"))
        encoders = joblib.load(os.path.join(BASE_DIR, "label_encoders.pkl"))
        feature_order = joblib.load(os.path.join(BASE_DIR, "feature_names.pkl"))

        
        raw_args = sys.argv[1:]

        
        input_data = {}
        for i, name in enumerate(feature_order):
            # Fallback to "0" if an argument is missing or undefined
            val = raw_args[i] if i < len(raw_args) else "0"
            
            if name in encoders:
                # Handle Categorical
                clean_val = str(val).lower().strip()
                try:
                   
                    input_data[name] = encoders[name].transform([clean_val])[0]
                except:
                    
                    input_data[name] = 0 
            else:
                # Handle Numerical
                try:
                    input_data[name] = float(val)
                except:
                    
                    input_data[name] = 0.0

       
        input_df = pd.DataFrame([input_data])[feature_order]
        
        
        prediction = model.predict(input_df)
        
        
        print(round(float(prediction[0]), 2))

    except Exception as e:
       
        sys.stderr.write(str(e))
        sys.exit(1)

if __name__ == "__main__":
    get_prediction()