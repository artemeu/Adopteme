import { expect } from 'chai';
import { generateData, generateMockPets, generateMockUsers } from '../src/utils/mocking.js';

describe('generateMockPets', () => {
  it('Debería generar el número correcto de mascotas y verifica si genera todas las propiedades', () => {
    const numPets = 5;
    const pets = generateMockPets(numPets);

    // Verificar que el número de mascotas generadas sea el correcto
    expect(pets).to.have.lengthOf(numPets);

    // Verificar que cada mascota tenga las propiedades esperadas
    pets.forEach(pet => {
      expect(pet).to.have.property('name').that.is.a('string');
      expect(pet).to.have.property('species').that.is.a('string');
      expect(pet).to.have.property('age').that.is.a('number');
      expect(pet).to.have.property('adopted').that.is.a('boolean');
      expect(pet).to.have.property('owner').that.is.null;
    });
  });
});

describe('generateMockUsers', () => {
  it('Debería generar usuarios con contraseñas encriptadas y verifica si genera todas las propiedades', async () => {
    const numUsers = 3;
    const users = await generateMockUsers(numUsers);

    // Verificar que se generó el número correcto de usuarios
    expect(users).to.have.lengthOf(numUsers);

    // Verificar que cada usuario tenga las propiedades esperadas
    users.forEach(user => {
      expect(user).to.have.property('first_name').that.is.a('string');
      expect(user).to.have.property('last_name').that.is.a('string');
      expect(user).to.have.property('email').that.is.a('string');
      expect(user).to.have.property('password').that.is.a('string');
      expect(user).to.have.property('role').that.is.oneOf(['user', 'admin']);
      expect(user).to.have.property('pets').that.is.an('array');
    });

    // Verificar que las contraseñas no sean el valor plano
    const plainPassword = 'coder123';
    users.forEach(user => {
      expect(user.password).to.not.equal(plainPassword);
    });
  });
});
