const ClothingItem = require("../models/clothingitem");
const {
  CAST_ERROR_ERROR_CODE,
  VALIDATION_DATA_CODE,
  NOT_FOUND_DATA_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      console.log(e.name);
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Error from createItem", e });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((e) => {
      console.log(e.name);
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Error from getItems", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = 404;
      throw error; // Remember to throw an error so .catch handles it instead of .then
    })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      console.log(e.name);
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Error from updateItem", e });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = 404;
      throw error;
    })
    .then((item) => {
      res.status(204).send({});
    })
    .catch((e) => {
      console.log(e.name);
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Error from deleteItem", e });
    });
};

module.exports.likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  );
// ...

module.exports.dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  );
// ...

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
};
