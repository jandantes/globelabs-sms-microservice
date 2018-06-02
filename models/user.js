const mongoose = require('mongoose');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  access_token: String,
  subscriber_number: String,
  active: {
    type: Boolean,
    default: true,
  },
  unsubscribed: {
    type: Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

const initModel = () => {
  if (mongoose.models.User) {
    return mongoose.model('User');
  }
  return mongoose.model('User', mongoSchema);
};

module.exports = initModel();
