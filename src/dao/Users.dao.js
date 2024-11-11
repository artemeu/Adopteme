import GenericDao from "./GenericDao.js";
import userModel from "./models/User.js";


export default class Users extends GenericDao {
    constructor() {
        super(userModel);
    }
}