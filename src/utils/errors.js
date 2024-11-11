export const errors = {
    // Errores comunes
    incompleteValues: { status: "error", error: "Incomplete values", code: 400 },
    internalServerError: { status: "error", error: "Internal server error", code: 500 },

    // Pets Controller
    petNotFound: { status: "error", error: "Pet not found", code: 404 },
    failedToRetrievePets: { status: "error", error: "Failed to retrieve pets", code: 500 },
    failedToCreatePet: { status: "error", error: "Failed to create pet", code: 500 },
    failedToUpdatePet: { status: "error", error: "Failed to update pet", code: 500 },
    failedToDeletePet: { status: "error", error: "Failed to delete pet", code: 500 },
    failedToCreatePetWithImage: { status: "error", error: "Failed to create pet with image", code: 500 },

    // Users Controller
    userNotFound: { status: "error", error: "User not found", code: 404 },
    failedToRetrieveUsers: { status: "error", error: "Failed to retrieve users", code: 500 },
    failedToCreateUser: { status: "error", error: "Failed to create user", code: 500 },
    failedToUpdateUser: { status: "error", error: "Failed to update user", code: 500 },
    failedToDeleteUser: { status: "error", error: "Failed to delete user", code: 500 },
    emailAlreadyExists: { status: "error", error: "Email already exists", code: 400 },
    invalidPassword: { status: "error", error: "Incorrect password", code: 400 },

    // Sessions Controller
    loginFailed: { status: "error", error: "Login failed", code: 401 },
    unauthorized: { status: "error", error: "Unauthorized", code: 401 },
    sessionExpired: { status: "error", error: "Session has expired", code: 401 },

    // Adoption Controller
    adoptionNotFound: { status: "error", error: "Adoption not found", code: 404 },
    failedToCreateAdoption: { status: "error", error: "Failed to create adoption", code: 500 },
    failedToRetrieveAdoptions: { status: "error", error: "Failed to retrieve adoptions", code: 500 },
    petAlreadyAdopted: { status: "error", error: "Pet is already adopted", code: 400 },
    userNotAdoptedPet: { status: "error", error: "User has not adopted this pet", code: 400 },

    // Mocks Controller
    failedToGenerateMockPets: { status: "error", error: "Failed to generate mock pets", code: 500 },
    failedToGenerateMockUsers: { status: "error", error: "Failed to generate mock users", code: 500 }
};
