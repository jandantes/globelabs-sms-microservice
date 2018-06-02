const mongoose = require('mongoose');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  dateTime: String,
  destinationAddress: String,
  messageId: String,
  message: String,
  resourceURL: String,
  senderAddress: String,
}, {
  timestamps: true,
});

const initModel = () => {
  if (mongoose.models.Message) {
    return mongoose.model('Message');
  }
  return mongoose.model('Message', mongoSchema);
};

module.exports = initModel();
