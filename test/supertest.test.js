import supertest from 'supertest';
import { expect } from 'chai';
import __dirname from '../src/utils/index.js';
import path from 'path';

const requester = supertest('http://localhost:8080');

describe('Test Adopciones', () => {
  let userId, petId, adoptionId; // Crear un usuario y una mascota antes de realizar todas las pruebas

  before(async () => {
    // Crear un usuario y una mascota específicos para las pruebas de adopciones
    const { body: userResponse } = await requester.post('/api/sessions/register').send({
      first_name: 'Test User',
      last_name: 'Pepe',
      email: 'testuser@example.com',
      password: 'password123'
    });
    userId = userResponse.payload;

    const { body: petResponse } = await requester.post('/api/pets').send({
      name: 'Test Pet',
      age: 2,
      species: 'Dog',
      birthDate: '2021-05-20',
      adopted: false // Asegúrate de que no esté adoptada
    });
    petId = petResponse.payload._id;

    const { body: adoptionResponse } = await requester.post(`/api/adoptions/${userId}/${petId}`);
    adoptionId = adoptionResponse.payload._id;
  });

  // Test para obtener todas las adopciones
  it('Debería obtener todas las adopciones en /api/adoptions [GET]', async () => {
    const { statusCode, ok, body } = await requester.get('/api/adoptions');

    expect(statusCode).to.be.eq(200);
    expect(ok).to.be.eq(true);
    expect(body.payload).to.be.an('array').that.is.not.empty; // Comprobamos que hay adopciones
  });

  // Test para obtener una adopción por ID
  it('Debería obtener una adopción por ID en /api/adoptions/:aid [GET]', async () => {
    const { statusCode, ok, body } = await requester.get(`/api/adoptions/${adoptionId}`);

    expect(statusCode).to.be.eq(200);
    expect(ok).to.be.eq(true);
    expect(body.payload).to.have.property('_id').to.eq(adoptionId);
  });

  // Test para obtener una adopción con ID incorrecto
  it('Debería devolver error al obtener una adopción con ID incorrecto en /api/adoptions/:aid [GET]', async () => {
    const { statusCode, ok, body } = await requester.get('/api/adoptions/6753894b5e8b2388cebf987a');

    expect(statusCode).to.be.eq(404);
    expect(body.error).to.eq('Adoption not found');
  });

  it('Debería crear una adopción en /api/adoptions/:uid/:pid [POST]', async () => {
    // Primero, verificamos que la mascota no esté adoptada antes de intentar adoptarla
    const { body: petResponse } = await requester.get(`/api/pets/${petId}`);

    // Si la mascota ya está adoptada, seleccionar otra mascota
    if (petResponse.payload.adopted) {
      const { body: newPetResponse } = await requester.get('/api/pets');
      petId = newPetResponse.payload.find(pet => !pet.adopted)._id;
    }

    // Realizar la solicitud POST para crear la adopción
    const { statusCode, ok, body } = await requester.post(`/api/adoptions/${userId}/${petId}`);

    // Verificar los valores esperados en la respuesta
    expect(statusCode).to.be.eq(200);
    expect(ok).to.be.eq(true);
    expect(body.message).to.eq('Pet adopted');
    expect(body.payload).to.have.property('owner').to.eq(userId);
    expect(body.payload).to.have.property('pet').to.eq(petId);
  });

  // Test para crear una adopción con una mascota ya adoptada
  it('Debería devolver error al intentar adoptar una mascota ya adoptada en /api/adoptions/:uid/:pid [POST]', async () => {
    // Adoptamos la mascota una vez
    await requester.post(`/api/adoptions/${userId}/${petId}`);

    // Intentamos adoptarla nuevamente
    const { statusCode, ok, body } = await requester.post(`/api/adoptions/${userId}/${petId}`);

    expect(statusCode).to.be.eq(400);
    expect(body.error).to.eq('Pet is already adopted');
  });

  // Test para crear una adopción con un usuario o mascota no encontrados
  it('Debería devolver error al intentar adoptar con un usuario inexistente en /api/adoptions/:uid/:pid [POST]', async () => {
    const { statusCode, ok, body } = await requester.post(
      `/api/adoptions/6753894b5e8b2388cebf987a/${petId}`
    );

    expect(statusCode).to.be.eq(404);
    expect(body.error).to.eq('User not found');
  });

  it('Debería devolver error al intentar adoptar una mascota inexistente en /api/adoptions/:uid/:pid [POST]', async () => {
    const { statusCode, ok, body } = await requester.post(
      `/api/adoptions/${userId}/6753894b5e8b2388cebf987a`
    );

    expect(statusCode).to.be.eq(404);
    expect(body.error).to.eq('Pet not found');
  });
});

describe('Test Usuarios', () => {
  let userId; //Cargar previamente un usuario en la base de datos

  before(async () => {
    // Obtener un usuario existente para usar su ID
    const { body } = await requester.get('/api/users');
    if (body.payload && body.payload.length > 0) {
      userId = body.payload[0]._id; // Tomamos el ID del primer usuario
    } else {
      throw new Error('No hay usuarios en la base de datos para ejecutar las pruebas.');
    }
  });

  // Test para obtener todos los usuarios
  it('Debería obtener todos los usuarios en /api/users [GET]', async () => {
    const { statusCode, ok, body } = await requester.get('/api/users');

    expect(statusCode).to.be.eq(200);
    expect(ok).to.be.eq(true);
    expect(body.payload).to.be.an('array');
  });

  // Test para obtener un solo usuario por su ID
  it('Debería obtener un usuario por ID en /api/users/:uid [GET]', async () => {
    const { statusCode, ok, body } = await requester.get(`/api/users/${userId}`);

    expect(statusCode).to.be.eq(200);
    expect(ok).to.be.eq(true);
    expect(body.payload).to.have.property('_id').to.eq(userId);
  });

  // Test para obtener un usuario con un ID incorrecto
  it('Debería devolver error al obtener un usuario con ID incorrecto en /api/users/:uid [GET]', async () => {
    const { statusCode, ok, body } = await requester.get('/api/users/6753894b5e8b2388cebf987a');

    expect(statusCode).to.be.eq(404);
    expect(body.error).to.eq('User not found');
  });

  // Test para actualizar un usuario
  it('Debería actualizar un usuario en /api/users/:uid [PUT]', async () => {
    const updatedData = {
      first_name: 'Jorge',
      email: 'carlos@gmail.com'
    };

    const { statusCode, ok, body } = await requester.put(`/api/users/${userId}`).send(updatedData);

    expect(statusCode).to.be.eq(200);
    expect(ok).to.be.eq(true);
    expect(body.payload).to.have.property('first_name').to.eq('Jorge');
  });

  // Test para eliminar un usuario
  it('Debería eliminar un usuario en /api/users/:uid [DELETE]', async () => {
    const { statusCode, ok, body } = await requester.delete(`/api/users/${userId}`);

    expect(statusCode).to.be.eq(200);
    expect(ok).to.be.eq(true);
    expect(body.message).to.eq('User deleted');
  });

  // Test para eliminar un usuario inexistente
  it('Debería devolver error al eliminar un usuario inexistente en /api/users/:uid [DELETE]', async () => {
    const { statusCode, ok, body } = await requester.delete('/api/users/6753894b5e8b2388cebf987a');

    expect(statusCode).to.be.eq(404);
    expect(body.error).to.eq('User not found');
  });

  // Test para eliminar todos los usuarios
  it('Debería eliminar todos los usuarios en /api/users [DELETE]', async () => {
    const { statusCode, ok, body } = await requester.delete('/api/users');

    expect(statusCode).to.be.eq(200);
    expect(ok).to.be.eq(true);
    expect(body.message).to.eq('All users records deleted');
  });
});

describe('Test Mascotas', () => {
  let petId; //Cargar previamente una mascota en la base de datos

  before(async () => {
    // Obtener una mascota existente para usar su ID
    const { body } = await requester.get('/api/pets');
    if (body.payload && body.payload.length > 0) {
      petId = body.payload[0]._id; // Tomamos el ID de la primera mascota
    } else {
      throw new Error('No hay mascotas en la base de datos para ejecutar las pruebas.');
    }
  });

  // Test para obtener todas las mascotas
  it('Debería obtener todas las mascotas en /api/pets [GET]', async () => {
    const { statusCode, ok, body } = await requester.get('/api/pets');
    expect(statusCode).to.be.eq(200);
    expect(ok).to.be.eq(true);
    expect(body.payload).to.be.an('array');
  });

  // Test para obtener una mascota por ID
  it('Debería obtener una mascota por ID en /api/pets/:pid [GET]', async () => {
    const { statusCode, ok, body } = await requester.get(`/api/pets/${petId}`);

    expect(statusCode).to.be.eq(200);
    expect(ok).to.be.eq(true);
    expect(body.payload).to.have.property('_id').to.eq(petId);
  });

  // Test para crear una mascota
  it('Debería crear una nueva mascota en /api/pets [POST]', async () => {
    const newPet = {
      name: 'Firulais',
      species: 'Dog',
      birthDate: '2020-01-01'
    };
    const { statusCode, ok, body } = await requester.post('/api/pets').send(newPet);

    expect(statusCode).to.be.eq(200);
    expect(ok).to.be.eq(true);
    expect(body.payload).to.have.property('_id');
    expect(body.payload).to.have.property('name').to.eq('Firulais');
  });

  // Test para obtener una mascota con ID incorrecto
  it('Debería devolver error al obtener una mascota con ID incorrecto en /api/pets/:pid [GET]', async () => {
    const { statusCode, ok, body } = await requester.get('/api/pets/6753894b5e8b2388cebf987a');

    expect(statusCode).to.be.eq(404);
    expect(body.error).to.eq('Pet not found');
  });

  // Test para crear una mascota sin datos obligatorios
  it('Debería devolver error al crear una mascota sin datos obligatorios en /api/pets [POST]', async () => {
    const { statusCode, ok, body } = await requester.post('/api/pets').send({});

    expect(statusCode).to.be.eq(400);
    expect(body.error).to.eq('Incomplete values');
  });

  // Test para crear una mascota con imagen
  it('Debería crear una mascota con imagen en /api/pets/withimage [POST]', async () => {
    const mockPet = {
      name: 'Michi',
      species: 'Cat',
      birthDate: '2021-05-20'
    };
    const filePath = path.resolve(__dirname, '../public/img/coderDog.jpg');
    const { statusCode, ok, body } = await requester
      .post('/api/pets/withimage')
      .field('name', mockPet.name)
      .field('species', mockPet.species)
      .field('birthDate', mockPet.birthDate)
      .attach('image', filePath);

    expect(statusCode).to.be.eq(200);
    expect(ok).to.be.eq(true);
    expect(body.payload).to.have.property('name').to.eq('Michi');
    expect(body.payload).to.have.property('image').that.is.a('string');
  });

  // Test para actualizar una mascota por su ID
  it('Debería actualizar una mascota en /api/pets/:pid [PUT]', async () => {
    const updatedData = { name: 'Updated Firulais', species: 'Updated Dog' };
    const { statusCode, ok, body } = await requester.put(`/api/pets/${petId}`).send(updatedData);

    expect(statusCode).to.be.eq(200);
    expect(ok).to.be.eq(true);
    expect(body.message).to.eq('Pet updated');
  });

  // Test para eliminar una mascota por su ID
  it('Debería eliminar una mascota en /api/pets/:pid [DELETE]', async () => {
    const { statusCode, ok, body } = await requester.delete(`/api/pets/${petId}`);
    expect(statusCode).to.be.eq(200);
    expect(ok).to.be.eq(true);
    expect(body.message).to.eq('Pet deleted');
  });

  // Test para eliminar una mascota inexistente
  it('Debería devolver error al eliminar una mascota inexistente en /api/pets/:pid [DELETE]', async () => {
    const { statusCode, ok, body } = await requester.delete('/api/pets/6753894b5e8b2388cebf987a');

    expect(statusCode).to.be.eq(404);
    expect(body.error).to.eq('Pet not found');
  });

  // Test para eliminar todas las mascota
  it('Debería eliminar todas las mascotas en /api/pets [DELETE]', async () => {
    const { statusCode, ok, body } = await requester.delete('/api/pets');
    expect(statusCode).to.be.eq(200);
    expect(ok).to.be.eq(true);
    expect(body.message).to.eq('All pet records deleted');
  });
});

describe('Test Sesiones', () => {
  let token;

  // Test para registrar un usuario
  it('Debería registrar un nuevo usuario en /api/sessions/register [POST]', async () => {
    const newUser = {
      first_name: 'Juan',
      last_name: 'Pérez',
      email: 'juan.perez@test.com',
      password: '123456'
    };

    const { statusCode, ok, body } = await requester.post('/api/sessions/register').send(newUser);

    expect(statusCode).to.be.eq(200);
    expect(ok).to.be.eq(true);
    expect(body.status).to.eq('success');
    expect(body.payload).to.be.a('string'); // ID del usuario registrado
  });

  // Test para iniciar sesión con un usuario registrado
  it('Debería iniciar sesión correctamente en /api/sessions/login [POST]', async () => {
    const credentials = {
      email: 'juan.perez@test.com',
      password: '123456'
    };

    const { statusCode, ok, body, headers } = await requester
      .post('/api/sessions/login')
      .send(credentials);

    expect(statusCode).to.be.eq(200);
    expect(ok).to.be.eq(true);
    expect(body.status).to.eq('success');
    expect(body.message).to.eq('Logged in');
    expect(headers['set-cookie']).to.be.an('array');

    // Verificar que la cookie esté presente en los headers
    expect(headers['set-cookie']).to.be.an('array');

    // Extraer la cookie de los headers y me aseguro de que contiene el token
    const cookie = headers['set-cookie'][0]; // Primer cookie en el encabezado
    expect(cookie).to.include('coderCookie'); // Verificar que contiene el nombre de la cookie
    token = cookie.split(';')[0].split('=')[1]; // Guardar el valor del token para las siguientes pruebas
  });

  // Test para obtener información del usuario actual
  it('Debería obtener el usuario actual en /api/sessions/current [GET]', async () => {
    const { statusCode, ok, body } = await requester
      .get('/api/sessions/current')
      .set('Cookie', `coderCookie=${token}`); // Pasar la cookie con el token

    expect(statusCode).to.be.eq(200);
    expect(ok).to.be.eq(true);
    expect(body.status).to.eq('success');
    expect(body.payload).to.have.property('email').to.eq('juan.perez@test.com');
  });

  // Test para acceder a /current sin cookie
  it('Debería fallar al acceder a /api/sessions/current sin cookie [GET]', async () => {
    const { statusCode, ok, body } = await requester.get('/api/sessions/current');

    expect(statusCode).to.be.eq(401);
    expect(ok).to.be.eq(false);
    expect(body.error).to.eq('Unauthorized');
  });

  // Test para acceder a /current con una cookie inválida
  it('Debería fallar al acceder a /api/sessions/current con cookie inválida [GET]', async () => {
    const { statusCode, ok, body } = await requester
      .get('/api/sessions/current')
      .set('Cookie', `coderCookie=invalidToken`);

    expect(statusCode).to.be.eq(401);
    expect(ok).to.be.eq(false);
    expect(body.error).to.eq('Session has expired');
  });
});
