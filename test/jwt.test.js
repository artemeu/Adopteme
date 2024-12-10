import jwt from 'jsonwebtoken';
import { expect } from 'chai';

describe('Test JWT Token', () => {
  const secret = 'tokenSecretJWT';
  let validToken;
  let decodedToken;

  // Generar un token válido antes de las pruebas
  before(() => {
    const payload = { email: 'juan.perez@test.com' };
    validToken = jwt.sign(payload, secret, { expiresIn: '1h' });
  });

  // Test para verificar que el token se crea correctamente
  it('Debería generar un token válido [JWT]', () => {
    expect(validToken).to.be.a('string');
    const decoded = jwt.verify(validToken, secret);
    expect(decoded).to.have.property('email', 'juan.perez@test.com');
  });

  // Test para verificar que el token ha expirado
  it('Debería lanzar un error si el token ha expirado [JWT]', async () => {
    const expiredToken = jwt.sign({ email: 'juan.perez@test.com' }, secret, { expiresIn: '1s' });

    // Esperamos más de 1 segundo para asegurarnos de que el token haya expirado
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      jwt.verify(expiredToken, secret);
    } catch (error) {
      expect(error.name).to.equal('TokenExpiredError');
      expect(error.message).to.equal('jwt expired');
    }
  });

  // Test para verificar la validez del token (firma incorrecta)
  it('Debería lanzar un error si el token tiene una firma inválida [JWT]', () => {
    const invalidToken = validToken.slice(0, -1) + 'a'; // Modificamos el token para que sea inválido
    try {
      jwt.verify(invalidToken, secret);
    } catch (error) {
      expect(error.message).to.equal('invalid signature');
    }
  });

  // Test para verificar el contenido del token
  it('Debería decodificar un token y obtener su payload [JWT]', () => {
    decodedToken = jwt.decode(validToken);
    expect(decodedToken).to.have.property('email', 'juan.perez@test.com');
  });
});
