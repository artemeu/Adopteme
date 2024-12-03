import { faker } from '@faker-js/faker';
import { createHash } from './index.js';

// Generador de mascotas mockeadas
export const generateMockPets = num => {
  const pets = [];
  for (let i = 0; i < num; i++) {
    const pet = {
      name: faker.animal.dog(), // Generar nombre aleatorio de perro
      species: faker.animal.type(),
      age: Math.floor(Math.random() * 15), // Edad aleatoria entre 0 y 15
      adopted: false,
      owner: null // No tiene dueño
    };
    pets.push(pet);
  }
  return pets;
};

// Generador de usuarios mockeados
export const generateMockUsers = async num => {
  const mockUsers = [];

  for (let i = 0; i < num; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const password = await createHash('coder123'); // Usamos la contraseña estática y la encriptamos
    const role = Math.random() > 0.5 ? 'user' : 'admin'; // Randomiza el rol entre user y admin
    const pets = [];

    mockUsers.push({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      role: role,
      pets: pets
    });
  }

  return mockUsers;
};

// Generador de usuarios mockeados con mascotas asignadas
export const generateData = async (numUsers, numPetsPerUser) => {
  const mockUsers = generateMockUsers(numUsers);

  // Generar un número aleatorio de mascotas para el usuario
  const numPets = faker.number.int({ min: 1, max: numPetsPerUser });
  const pets = generateMockPets(numPets);

  mockUsers.push({
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
    role: role,
    pets: pets
  });

  return mockUsers;
};
