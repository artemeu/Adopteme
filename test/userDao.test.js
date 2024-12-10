import mongoose from 'mongoose';
import Users from '../src/dao/Users.dao.js';
import { expect } from 'chai';

mongoose.connect(
  `mongodb+srv://artemeu1:fbvjSFu91cXHPgUC@coderback.0uqebpv.mongodb.net/?retryWrites=true&w=majority&appName=CoderBack`,
  () => {
    console.log('Base de datos conectada');
  }
);

describe('User Dao', () => {
  before(function () {
    this.userDao = new Users();
  });

  // Crear un usuario de prueba antes de las pruebas
  beforeEach(async function () {
    // Crear un usuario de prueba
    await this.userDao.save({
      first_name: 'Carlos',
      last_name: 'Gomez',
      email: 'carlos@gmail.com',
      password: '123',
      role: 'user',
      pets: []
    });
  });

  // Test para verificar el array
  it('Debería de retornar un array de usuarios', async function () {
    const result = await this.userDao.get();
    expect(result).to.be.an('array');
  });

  // Test para verificar los datos por mail
  it('Debería de retornar un usuario por mail', async function () {
    const email = 'carlos@gmail.com';
    const result = await this.userDao.getBy({ email });

    // Verificamos que el resultado tenga los valores correctos
    expect(result).to.be.an('object');
    expect(result.first_name).to.equal('Carlos');
    expect(result.last_name).to.equal('Gomez');
  });

  // Test para verificar mail incorrecto
  it('Debería de retornar null si el usuario no existe', async function () {
    const email = 'noexistentemail@example.com';
    const result = await this.userDao.getBy({ email });

    // Verificamos que el resultado sea null cuando el usuario no existe
    expect(result).to.be.null;
  });

  // Test de usuarios con mascotas
  it('Debería agregar mascotas a un usuario correctamente', async function () {
    const user = await this.userDao.getBy({ email: 'carlos@gmail.com' });

    const petId = mongoose.Types.ObjectId();

    user.pets.push({ _id: petId });

    const updatedUser = await this.userDao.update(user._id, { pets: user.pets });

    // Verificamos que el usuario haya sido actualizado correctamente con la mascota
    expect(updatedUser.pets.some(pet => pet._id.toString() === petId.toString())).to.be.true;
  });

  // Test de actualización de usuario
  it('Debería actualizar un usuario correctamente', async function () {
    const email = 'carlos@gmail.com';
    const updatedData = { first_name: 'Carlos', last_name: 'Gomez Updated' };

    const user = await this.userDao.getBy({ email });
    const updatedUser = await this.userDao.update(user._id, updatedData);

    // Verificamos que la actualización fue exitosa
    expect(updatedUser).to.have.property('_id');
    expect(updatedUser.first_name).to.equal('Carlos');
    expect(updatedUser.last_name).to.equal('Gomez Updated');
  });

  // Limpiar después del test la base de datos
  afterEach(async function () {
    await mongoose.connection.dropCollection('users');
  });

  after(function () {
    mongoose.connection.close();
  });
});
