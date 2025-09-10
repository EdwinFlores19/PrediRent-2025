// Mock API para autenticación

// Simula una base de datos de usuarios
const users = [
  {
    id: '1',
    email: 'user@test.com',
    password: 'password123',
    name: 'Usuario de Prueba',
    tier: 'Premium'
  }
];

const generateFakeToken = () => 'fake-jwt-token-' + Math.random().toString(36).substring(2);

export const loginApi = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        resolve({
          user: userWithoutPassword,
          token: generateFakeToken(),
        });
      } else {
        reject(new Error('Email o contraseña incorrectos.'));
      }
    }, 1000);
  });
};

export const registerApi = (userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (users.some(u => u.email === userData.email)) {
        return reject(new Error('El email ya está en uso.'));
      }
      const newUser = {
        id: String(users.length + 1),
        ...userData,
        tier: 'Freemium',
      };
      users.push(newUser);
      const { password, ...userWithoutPassword } = newUser;
      resolve({
        user: userWithoutPassword,
        token: generateFakeToken(),
      });
    }, 1000);
  });
};

export const logoutApi = () => {
  return new Promise(resolve => {
    setTimeout(resolve, 500);
  });
};
