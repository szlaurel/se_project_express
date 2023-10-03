const User = require('../models/user');

const createUser = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      console.log(user);
      res.send({ data: user });
    })
    .catch((e) => {
      console.log(e.name);
      res.status(500).send({ message: 'Error from createUser', e });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error('User ID not found');
      error.statusCode = 404;
      throw error; // Remember to throw an error so .catch handles it instead of .then
    })
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((e) => {
      console.log(e.name);
      res.status(500).send({ message: 'Error from createUser', e });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((e) => {
      console.log(e.name);
      res.status(500).send({ message: 'Error from createUser', e });
    });
};

module.exports = {
  createUser,
  getUser,
  getUsers,
};
