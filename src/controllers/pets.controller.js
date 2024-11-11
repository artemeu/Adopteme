import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";


// Obtener todas las mascotas
const getAllPets = async (req, res, next) => {
    try {
        const pets = await petsService.getAll();
        res.send({ status: "success", payload: pets });
    } catch (error) {
        next({ type: "internalServerError" });
    }
};

// Crear una nueva mascota
const createPet = async (req, res, next) => {
    const { name, specie, birthDate } = req.body;
    if (!name || !specie || !birthDate) return next({ type: "incompleteValues" });

    try {
        const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
        const result = await petsService.create(pet);
        res.send({ status: "success", payload: result });
    } catch (error) {
        next({ type: "failedToCreatePet" });
    }
};

// Actualizar una mascota existente
const updatePet = async (req, res, next) => {
    const petUpdateBody = req.body;
    const petId = req.params.pid;

    try {
        const result = await petsService.update(petId, petUpdateBody);
        if (!result) return next({ type: "petNotFound" });
        res.send({ status: "success", message: "Pet updated" });
    } catch (error) {
        next({ type: "failedToUpdatePet" });
    }
};

// Eliminar una mascota
const deletePet = async (req, res, next) => {
    const petId = req.params.pid;

    try {
        const result = await petsService.delete(petId);
        if (!result) return next({ type: "petNotFound" });
        res.send({ status: "success", message: "Pet deleted" });
    } catch (error) {
        next({ type: "failedToDeletePet" });
    }
};

const clearAllPets = async (req, res, next) => {
    try {
        await petsService.deleteAll();
        res.send({ status: 'success', message: 'All pet records deleted' });
    } catch (error) {
        next({ type: "failedToDeletePet" });
    }
};

// Crear una mascota con imagen
const createPetWithImage = async (req, res, next) => {
    const file = req.file;
    const { name, specie, birthDate } = req.body;

    if (!name || !specie || !birthDate || !file) return next({ type: "incompleteValues" });

    try {
        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image: `${__dirname}/../public/img/${file.filename}`,
        });

        const result = await petsService.create(pet);
        res.send({ status: "success", payload: result });
    } catch (error) {
        next({ type: "failedToCreatePetWithImage" });
    }
};

export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage,
    clearAllPets
}