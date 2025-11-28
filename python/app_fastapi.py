from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import pandas as pd
import joblib
import json
import os

app = FastAPI(title="PrediRent AI Microservice")

# Configuración de rutas
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'modelo_precio.joblib')
METADATA_PATH = os.path.join(BASE_DIR, 'models', 'metadata.json')

# Carga de recursos al inicio
model = None
expected_columns = []

try:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
    if os.path.exists(METADATA_PATH):
        with open(METADATA_PATH, 'r') as f:
            metadata = json.load(f)
            expected_columns = metadata.get('columns', [])
except Exception as e:
    print(f"Error cargando modelo: {e}")

# Esquema de entrada (Coincide con el payload de Node.js)
class PropertyPayload(BaseModel):
    tipoPropiedad: str
    tipoAlojamiento: str
    distrito: str
    provincia: str = "Lima"
    huespedes: int
    habitaciones: int
    camas: int
    baños: int
    comodidades: List[str] = []

@app.post("/predict")
def predict(payload: PropertyPayload):
    # 1. Fallback si no hay modelo
    if not model:
        return {"precio_predicho": 1500.0, "dummy": True, "status": "fallback"}

    try:
        # 2. Mapeo de Datos (Node.js -> Modelo ML)
        # El modelo espera: 'NumHabitaciones', 'TipoPropiedad', 'Wifi' (si one-hot), etc.
        input_data = {
            'TipoPropiedad': payload.tipoPropiedad,
            'TipoAlojamiento': payload.tipoAlojamiento,
            'Distrito': payload.distrito,
            'Provincia': payload.provincia,
            'NumHuespedes': payload.huespedes,
            'NumHabitaciones': payload.habitaciones,
            'NumCamas': payload.camas,
            'NumBanos': payload.baños
        }

        # 3. One-Hot Encoding para Comodidades
        # Convertimos la lista ['Wifi', 'Cocina'] a columnas {'Wifi': 1, 'Cocina': 1}
        for com in payload.comodidades:
            input_data[com] = 1

        # 4. Crear DataFrame y rellenar faltantes
        df = pd.DataFrame([input_data])
        
        # Asegurar que todas las columnas esperadas por el modelo existan (rellenar con 0)
        for col in expected_columns:
            if col not in df.columns:
                df[col] = 0
                
        # Ordenar columnas estrictamente como el modelo espera
        df = df[expected_columns]

        # 5. Predicción
        prediction = model.predict(df)[0]
        
        return {
            "precio_predicho": float(prediction),
            "dummy": False,
            "status": "success"
        }

    except Exception as e:
        # Log del error real pero respuesta segura al cliente
        print(f"Error en predicción: {str(e)}")
        # Fallback de emergencia
        return {"precio_predicho": 1450.0, "dummy": True, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
