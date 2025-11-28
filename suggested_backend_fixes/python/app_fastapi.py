import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI()

# Definición del esquema de entrada (Payload del Backend Node.js)
class PropertyPayload(BaseModel):
    huespedes: int
    habitaciones: int
    banos: int
    camas: int
    metraje: float
    distrito: str
    tipoPropiedad: str
    tipoAlojamiento: str
    comodidades: Optional[List[str]] = []
    seguridad: Optional[List[str]] = []

# Cargar el modelo al inicio
MODEL_PATH = "modelo_precio.joblib"
model = None

try:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"Modelo cargado desde {MODEL_PATH}")
    else:
        print(f"ADVERTENCIA: No se encontró {MODEL_PATH}. Se usará modo fallback.")
except Exception as e:
    print(f"ERROR al cargar el modelo: {e}")

def map_input_to_model_features(payload: PropertyPayload) -> pd.DataFrame:
    """
    Transforma el payload del backend al formato esperado por el modelo XGBoost.
    """
    # 1. Mapeo directo de nombres
    data = {
        'NumHuespedes': [payload.huespedes],
        'NumHabitaciones': [payload.habitaciones],
        'NumBanos': [payload.banos],
        'NumCamas': [payload.camas],
        'Metraje': [payload.metraje],
        'Distrito': [payload.distrito],
        'TipoPropiedad': [payload.tipoPropiedad],
        'TipoAlojamiento': [payload.tipoAlojamiento]
        # Aquí se debería agregar lógica para 'comodidades' si el modelo usa OneHotEncoding o conteo
        # Por ejemplo: 'TieneWifi': 1 if 'Wifi' in payload.comodidades else 0
    }
    
    # Crear DataFrame
    df = pd.DataFrame(data)
    
    # NOTA: En un caso real, aquí deberíamos aplicar el mismo preprocesamiento 
    # que se usó en el entrenamiento (LabelEncoding para Distrito, etc.)
    # Si el modelo es un Pipeline que incluye el preprocesamiento, esto es suficiente.
    
    return df

@app.post("/predict")
def predict_price(payload: PropertyPayload):
    try:
        # Fallback inmediato si no hay modelo
        if model is None:
            return {"precio_predicho": 1500, "dummy": True, "reason": "Model not loaded"}

        # Mapear datos
        df_features = map_input_to_model_features(payload)
        
        # Predecir
        prediction = model.predict(df_features)
        price = float(prediction[0])
        
        return {"precio_predicho": price, "dummy": False}

    except Exception as e:
        print(f"Error durante la predicción: {e}")
        # Fallback robusto en caso de error en predicción (ej. columnas faltantes)
        return {"precio_predicho": 1500, "dummy": True, "error": str(e)}

@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": model is not None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
