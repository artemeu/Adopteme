import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

describe('Test mascotas', () => {
  it('Deberia de crear correctamente una mascota en /api/pets/ [POST]', async () => {
    const mockPet = {
      name: 'Firulai',
      specie: 'Perro',
      birthDate: new Date('19-03-2023')
    };
    const { statusCode, ok, _body } = (await requester.post('/api/pets/')).setEncoding(mockPet);
    expect(statusCode).to.be.eq(200);
    expect(ok).to.be.eq(true);
    expect(_body.payload).to.have.property('_id');
    expect(_body.payload).to.have.property('name');
    expect(_body.payload.odopted).to.not.eq(true);
  });
});

describe('Login/Register', () => {
  let cookie = {};
  // it('Deberia de registrar un usuario correctamente', async () => {
  //     const mockUser = {
  //         first_name: 'Mauri',
  //         last_name: 'Rosas',
  //         email: 'asd@gmail.com',
  //         password: 'coder123'
  //     }

  //     const {statusCode, _body} = await requester.post('/api/sessions/register').send(mockUser)

  //     expect(statusCode).to.be.eq(200);
  //     expect(_body.payload).to.be.ok;
  // })

  it('Deberia de loguear correctamente y ademas devolver una cookie por header', async () => {
    const mockUser = {
      email: 'asd@gmail.com',
      password: 'coder123'
    };
    const response = await requester.post('/api/sessions/login').send(mockUser);
    // console.log(response)
    const cookieResult = response.headers['set-cookie'][0];

    expect(cookieResult).to.be.ok;

    const { 0: nameCookie, 1: valueCookie } = cookieResult.split('=');
    cookie = {
      name: nameCookie, // el nombre de la cookie
      value: valueCookie
    };
    expect(cookie.name).to.be.ok.and.eql('coderCookie');
    expect(cookie.value).to.be.ok;
  });

  it('Debe de validar la cookie, obtener el token y devolver el usuario de dicho token', async () => {
    const { _body } = await requester
      .get('/api/sessions/current')
      .set('Cookie', [`${cookie.name}=${cookie.value}`]); // cookie -> nombre = valor
    expect(_body.payload.email).to.be.eql('asd@gmail.com');
  });
});

describe('Multer/cargar imagen', () => {
  it('Debe de crear una mascota con imagen', async () => {
    const mockPet = {
      name: 'Balta',
      specie: 'Labrador',
      birthDate: new Date('20-01-2020')
    };

    const { statusCode, _body } = await requester
      .post('/api/pets/withimage')
      .field('name', mockPet.name)
      .field('specie', mockPet.specie)
      .field('birthDate', mockPet.birthDate);
    // .attach('image', `${__dirname}/img/coderDog.jpg`)

    expect(statusCode).to.eql(200);
    expect(_body.payload).to.have.property('_id');
    expect(_body.payload.image).to.be.ok;
  });
});
