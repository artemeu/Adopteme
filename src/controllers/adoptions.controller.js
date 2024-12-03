import { adoptionsService, petsService, usersService } from '../services/index.js';

const getAllAdoptions = async (req, res, next) => {
  try {
    const result = await adoptionsService.getAll();
    res.send({ status: 'success', payload: result });
  } catch (error) {
    next({ type: 'failedToRetrieveAdoptions' });
  }
};

const getAdoption = async (req, res, next) => {
  const adoptionId = req.params.aid;
  try {
    const adoption = await adoptionsService.getBy({ _id: adoptionId });
    if (!adoption) return next({ type: 'adoptionNotFound' });
    res.send({ status: 'success', payload: adoption });
  } catch (error) {
    next({ type: 'failedToRetrieveAdoptions' });
  }
};

const createAdoption = async (req, res, next) => {
  const { uid, pid } = req.params;

  try {
    const user = await usersService.getUserById(uid);
    if (!user) return next({ type: 'userNotFound' });

    const pet = await petsService.getBy({ _id: pid });
    if (!pet) return next({ type: 'petNotFound' });

    if (pet.adopted) return next({ type: 'petAlreadyAdopted' });

    // Actualizar las mascotas del usuario y la propiedad de la mascota
    user.pets.push(pet._id);
    const userUpdate = await usersService.update(user._id, { pets: user.pets });
    if (!userUpdate) return next({ type: 'failedToUpdateUser' });

    const petUpdate = await petsService.update(pet._id, { adopted: true, owner: user._id });
    if (!petUpdate) return next({ type: 'failedToUpdatePet' });

    // Crear la adopción
    const adoption = await adoptionsService.create({ owner: user._id, pet: pet._id });
    if (!adoption) return next({ type: 'failedToCreateAdoption' });

    res.send({ status: 'success', message: 'Pet adopted', payload: adoption });
  } catch (error) {
    next({ type: 'failedToCreateAdoption' });
  }
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption
};
