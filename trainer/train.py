import joblib
from sklearn.ensemble import RandomForestClassifier
import os
from utils import extract_features

# Demo dataset
urls = ["http://example-phish.test/login","https://bank.com","http://secure-login.info"]
labels = [1,0,1]  # 1=phishing, 0=safe

X = [list(extract_features(u).values()) for u in urls]
y = labels

clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X, y)

os.makedirs("../models", exist_ok=True)
joblib.dump(clf, "../models/phishing_model.joblib")
print("✅ Saved upgraded AI model")
