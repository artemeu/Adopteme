export default class GenericDao {
  constructor(model) {
    this.model = model;
  }

  get = params => {
    return this.model.find(params);
  };

  getBy = params => {
    return this.model.findOne(params);
  };

  save = doc => {
    return this.model.create(doc);
  };

  saveMany = docs => {
    return this.model.insertMany(docs);
  };

  update = (id, doc) => {
    return this.model.findByIdAndUpdate(id, { $set: doc }, { new: true });
  };

  delete = id => {
    return this.model.findByIdAndDelete(id);
  };

  deleteAll = () => {
    return this.model.deleteMany({});
  };
}
