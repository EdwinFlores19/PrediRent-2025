const freemiumData = {
  propiedadesActivas: 3,
  ingresosMes: 4500,
  ocupacionPromedio: 85,
};

const premiumData = {
  ...freemiumData,
  nuevosLeads: 25,
  precioPromedioMercado: 1350,
  satisfaccionInquilinos: 95,
};

export const getDashboardData = (userTier) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userTier === 'Premium') {
        resolve(premiumData);
      } else if (userTier === 'Freemium') {
        resolve(freemiumData);
      } else {
        reject(new Error('Plan de usuario no reconocido.'));
      }
    }, 1200);
  });
};
