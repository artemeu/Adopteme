import GenericDao from "./GenericDao.js";
import petModel from "./models/Pet.js";


export default class Pets extends GenericDao {
    constructor() {
        super(petModel);
    }
}