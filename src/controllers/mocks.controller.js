import { generateMockPets, generateMockUsers } from "../utils/mocking.js";
import { petsService, usersService } from "../services/index.js";

// Generar mascotas mockeadas
const petsMock = async (req, res, next) => {
    try {
        const { num } = req.query;
        const numberOfPets = num ? parseInt(num) : 100;
        if (isNaN(numberOfPets) || numberOfPets <= 0) {
            return next({ type: "incompleteValues" });
        }

        const mockedPets = generateMockPets(numberOfPets);
        res.send({ status: 'success', payload: mockedPets });
    } catch (error) {
        next({ type: "failedToGenerateMockPets" });
    }
};

// Generar usuarios mockeados
const usersMock = async (req, res, next) => {
    const { num } = req.query;
    const numberOfUsers = num ? parseInt(num) : 50;

    if (isNaN(numberOfUsers) || numberOfUsers <= 0) {
        return next({ type: "incompleteValues" });
    }
    try {
        const users = await generateMockUsers(numberOfUsers);
        res.send({ status: "success", payload: users });
    } catch (error) {
        next({ type: "failedToGenerateMockUsers" });
    }
};

// Generar e insertar usuarios y mascotas en la base de datos
const generateData = async (req, res, next) => {
    const { users, pets } = req.query;

    const numberOfUsers = users ? parseInt(users) : 0;
    const numberOfPets = pets ? parseInt(pets) : 0;

    // Validación de parámetros
    if (isNaN(numberOfUsers) || numberOfUsers < 0 || isNaN(numberOfPets) || numberOfPets < 0) {
        return res.status(400).send({ status: "error", message: "Parámetros inválidos. 'users' y 'pets' deben ser números no negativos." });
    }
    try {
        // Generar y almacenar usuarios mockeados
        if (numberOfUsers > 0) {
            const generatedUsers = await generateMockUsers(numberOfUsers);
            await usersService.createMany(generatedUsers);
        }
        // Generar y almacenar mascotas mockeadas
        if (numberOfPets > 0) {
            const generatedPets = generateMockPets(numberOfPets);
            await petsService.createMany(generatedPets);
        }
        res.send({
            status: "success",
            message: `${numberOfUsers} usuarios y ${numberOfPets} mascotas generados e insertados en la base de datos.`,
        });
    } catch (error) {
        next({ type: "failedToGenerateMockData", message: error.message });
    }
};

export default {
    petsMock,
    usersMock,
    generateData
};
