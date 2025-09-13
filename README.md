# Titanic Survival Prediction

Predict survival on the Titanic using machine learning models and a modern web interface.

## Project Structure

```
Titanic Survival Prediction/
├── data/
│   ├── processed/
│   │   ├── train.csv
│   │   ├── train_output.csv
│   │   └── test.csv
│   └── raw/
│       ├── gender_submission.csv
│       ├── test.csv
│       └── train.csv
├── notebooks/
│   ├── modeling.ipynb
│   └── preprocessing.ipynb
├── reports/
│   ├── Figures/
│   │   └── output.png
│   └── summary.pdf
├── frontend/
│   └── app/
│       └── page.tsx
├── requirements.txt
└── README.md
```

## Features

- Data preprocessing and feature engineering
- Model training: Logistic Regression, Random Forest, XGBoost
- Cross-validation and evaluation metrics
- PCA visualization
- FastAPI backend for predictions
- React/Next.js frontend for user input and results

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/ahmadbuilds/Titanic-Survival-Prdiction.git
cd Titanic-Survival-Prdiction
```

### 2. Python Environment & Dependencies

Create a virtual environment and install dependencies:

```sh
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Key dependencies:**

- `fastapi[standard]` (for full FastAPI features)
- `pandas`, `numpy`, `scikit-learn`, `matplotlib`, `xgboost`

### 3. Data Preparation

- Place raw data files in `data/raw/`.
- Run `notebooks/preprocessing.ipynb` to generate processed data in `data/processed/`.

### 4. Model Training & Evaluation

- Use `notebooks/modeling.ipynb` to train models and evaluate performance.
- Results and figures are saved in `reports/`.

### 5. Backend API (FastAPI)

Start the backend server:

```sh
uvicorn src.main:app --reload
```

- The API will be available at `http://127.0.0.1:8000`.

### 6. Frontend (React/Next.js)

Navigate to the frontend directory and start the app:

```sh
cd frontend
npm install
npm run dev
```

- The web app will be available at `http://localhost:3000`.

## Usage

- Open the web app and enter passenger details.
- Click "Predict Survival" to get predictions from multiple models.
- View model accuracy and results in the reports.

## File Descriptions

- `notebooks/preprocessing.ipynb`: Data cleaning and feature engineering.
- `notebooks/modeling.ipynb`: Model training, evaluation, and visualization.
- `frontend/app/page.tsx`: Main React page for user input and prediction display.
- `reports/summary.pdf`: Summary of preprocessing, modeling, and results.
- `requirements.txt`: Python dependencies (uses `fastapi[standard]` for full FastAPI support).

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Kaggle Titanic Dataset
- scikit-learn, XGBoost, FastAPI, React, Next.js
