import pandas as pd

# Load dataset 
data = pd.read_csv("./dataset/carbon_footprint.csv")

print("Original data loaded successfully")
print(data.head())

# Remove missing values
data = data.dropna()

# Remove duplicate rows
data = data.drop_duplicates()

# Save cleaned dataset
data.to_csv("./dataset/cleaned_carbon.csv", index=False)

print("Cleaned data saved successfully")
