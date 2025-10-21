import joblib, os
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "phishing_model.joblib")
model = joblib.load(MODEL_PATH)
