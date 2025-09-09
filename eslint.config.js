// eslint.config.js
// Este archivo configura ESLint para el proyecto, asegurando la calidad del código.

import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  // Configuración para entornos de navegador, habilitando variables globales como 'window' y 'document'.
  {languageOptions: { globals: globals.browser }},
  // Reglas recomendadas de ESLint para JavaScript.
  pluginJs.configs.recommended,
  // Reglas recomendadas de ESLint para React, incluyendo buenas prácticas y detección de errores comunes.
  pluginReactConfig,
];