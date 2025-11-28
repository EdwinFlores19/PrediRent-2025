import pandas as pd
import joblib
import json
import sys
import os

# Rutas absolutas para evitar errores de ejecución desde Node
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'modelo_precio.joblib')
METADATA_PATH = os.path.join(BASE_DIR, 'models', 'metadata.json')

def predict_local(data):
    try:
        # Cargar modelo
        if not os.path.exists(MODEL_PATH):
            return {"precio_predicho": 1600.0, "dummy": True, "reason": "Model file not found"}
            
        model = joblib.load(MODEL_PATH)
        with open(METADATA_PATH, 'r') as f:
            metadata = json.load(f)
        expected_columns = metadata['columns']

        # Mapeo (Igual que en FastAPI)
        mapped_data = {
            'TipoPropiedad': data.get('tipoPropiedad'),
            'TipoAlojamiento': data.get('tipoAlojamiento'),
            'Distrito': data.get('distrito'),
            'Provincia': data.get('provincia', 'Lima'),
            'NumHuespedes': int(data.get('huespedes', 1)),
            'NumHabitaciones': int(data.get('habitaciones', 1)),
            'NumCamas': int(data.get('camas', 1)),
            'NumBanos': int(data.get('baños', 1))
        }
        
        # Comodidades
        for com in data.get('comodidades', []):
            mapped_data[com] = 1

        df = pd.DataFrame([mapped_data])

        # Rellenar columnas faltantes con 0
        for col in expected_columns:
            if col not in df.columns:
                df[col] = 0
        
        df = df[expected_columns]

        prediction = model.predict(df)[0]
        return {"precio_predicho": float(prediction), "dummy": False}

    except Exception as e:
        return {"precio_predicho": 1550.0, "dummy": True, "error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            input_json = json.loads(sys.argv[1])
            print(json.dumps(predict_local(input_json)))
        except Exception as e:
            print(json.dumps({"error": "Invalid JSON input", "details": str(e)}))
    else:
        print(json.dumps({"error": "No input data provided"}))
