import mongoose from 'mongoose';

const collection = 'Pets';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  species: {
    type: String,
    required: true
  },
  birthDate: Date,
  adopted: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Users'
  },
  image: String
});

// Configurar una transformación automática para JSON
schema.set('toJSON', {
  transform: (doc, ret) => {
    // Formatear el campo birthDate si existe
    if (ret.birthDate) {
      ret.birthDate = new Date(ret.birthDate).toISOString().split('T')[0];
    }
    return ret;
  }
});

const petModel = mongoose.model(collection, schema);

export default petModel;
