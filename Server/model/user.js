const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
  name: String,
  PoloniexKeyAPI: String,
  PoloniexSecretAPI: String,
  BittrexKeyAPI: String,
  BittrexSecretAPI: String
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const User = mongoose.model('User', userSchema);
module.exports = User;