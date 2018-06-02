const mongoose = require('mongoose');
const Message = require('./models/message');
const User = require('./models/user');

const { json, send } = require('micro');
const { router, get, post } = require('microrouter');

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const MONGO_URL = dev ? process.env.MONGO_URL_DEV : process.env.MONGO_URL;

mongoose.connect(MONGO_URL);

const receive = async (req, res) => {
  try {
    const { inboundSMSMessageList: { inboundSMSMessage: messages } } = await json(req);
    await Message.insertMany(messages);
    send(res, 200);
  } catch (err) {
    send(res, 500, { error: err.message || err.toString() });
  }
};

const opt = async (req, res) => {
  try {
    const { access_token, subscriber_number, unsubscribed } = await json(req); // eslint-disable-line camelcase,max-len
    if (!unsubscribed) {
      await User.create({ access_token, subscriber_number });
    } else {
      await User.findOneAndUpdate({
        subscriber_number: unsubscribed.subscriber_number,
      }, {
        unsubscribed,
        active: false,
      });
    }
    send(res, 200);
  } catch (err) {
    send(res, 500, { error: err.message || err.toString() });
  }
};

const notfound = (req, res) => send(res, 404, 'Not found');

console.log(`> Ready on: ${process.env.NODE_ENV}`); // eslint-disable-line

module.exports = router(
  post('/receive', receive),
  post('/opt', opt),
  get('/*', notfound),
  post('/*', notfound),
);
