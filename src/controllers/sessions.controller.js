import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';

const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) {
            return next({ type: "incompleteValues" });
        }

        const exists = await usersService.getUserByEmail(email);
        if (exists) {
            return next({ type: "emailAlreadyExists" });
        }

        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        };

        let result = await usersService.create(user);
        res.send({ status: "success", payload: result._id });
    } catch (error) {
        next({ type: "failedToCreateUser" });
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next({ type: "incompleteValues" });
    }

    try {
        const user = await usersService.getUserByEmail(email);
        if (!user) {
            return next({ type: "userNotFound" });
        }

        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            return next({ type: "invalidPassword" });
        }

        const userDto = UserDTO.getUserTokenFrom(user);
        const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: "1h" });

        res.cookie('coderCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Logged in" });
    } catch (error) {
        next({ type: "internalServerError" });
    }
};

const current = async (req, res, next) => {
    const cookie = req.cookies['coderCookie'];
    if (!cookie) {
        return next({ type: "unauthorized" });
    }

    try {
        const user = jwt.verify(cookie, 'tokenSecretJWT');
        return res.send({ status: "success", payload: user });
    } catch (error) {
        next({ type: "sessionExpired" });
    }
};

const unprotectedLogin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next({ type: "incompleteValues" });
    }

    try {
        const user = await usersService.getUserByEmail(email);
        if (!user) {
            return next({ type: "userNotFound" });
        }

        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            return next({ type: "invalidPassword" });
        }

        const token = jwt.sign(user, 'tokenSecretJWT', { expiresIn: "1h" });
        res.cookie('unprotectedCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Unprotected Logged in" });
    } catch (error) {
        console.error(error);
        next({ type: "internalServerError" });
    }
};

const unprotectedCurrent = async (req, res, next) => {
    const cookie = req.cookies['unprotectedCookie'];
    if (!cookie) {
        return next({ type: "unauthorized" });
    }

    try {
        const user = jwt.verify(cookie, 'tokenSecretJWT');
        return res.send({ status: "success", payload: user });
    } catch (error) {
        next({ type: "sessionExpired" });
    }
};

export default {
    current,
    login,
    register,
    current,
    unprotectedLogin,
    unprotectedCurrent
}