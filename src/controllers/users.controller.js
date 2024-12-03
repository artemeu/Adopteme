import { usersService } from '../services/index.js';

const getAllUsers = async (req, res, next) => {
  try {
    const users = await usersService.getAll();
    res.send({ status: 'success', payload: users });
  } catch (error) {
    next({ type: 'failedToRetrieveUsers' });
  }
};

const getUser = async (req, res, next) => {
  const userId = req.params.uid;
  try {
    const user = await usersService.getUserById(userId);
    if (!user) return next({ type: 'userNotFound' });
    res.send({ status: 'success', payload: user });
  } catch (error) {
    next({ type: 'failedToRetrieveUser' });
  }
};

const updateUser = async (req, res, next) => {
  const updateBody = req.body;
  const userId = req.params.uid;
  try {
    const user = await usersService.getUserById(userId);
    if (!user) return next({ type: 'userNotFound' });

    await usersService.update(userId, updateBody);
    const updatedUser = await usersService.getUserById(userId);
    res.send({ status: 'success', message: 'User updated', payload: updatedUser });
  } catch (error) {
    next({ type: 'failedToUpdateUser' });
  }
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.uid;
  try {
    const user = await usersService.getUserById(userId);
    if (!user) return next({ type: 'userNotFound' });

    await usersService.delete(userId);
    res.send({ status: 'success', message: 'User deleted' });
  } catch (error) {
    next({ type: 'failedToDeleteUser' });
  }
};

const clearAllUsers = async (req, res, next) => {
  try {
    await usersService.deleteAll();
    res.send({ status: 'success', message: 'All users records deleted' });
  } catch (error) {
    next({ type: 'failedToDeleteUser' });
  }
};

export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  clearAllUsers
};
