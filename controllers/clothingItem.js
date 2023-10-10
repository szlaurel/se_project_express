const ClothingItem = require("../models/clothingitem");
const {
  CAST_ERROR_ERROR_CODE,
  VALIDATION_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      console.log("im here in then for add an item");
      if (item.imageUrl === undefined) {
        console.log("well it is");
      } else {
        console.log("nope nada");
      }
      res.send({ data: item });
    })
    .catch((e) => {
      console.log(e.name);
      // console.log(name);
      // console.log(weather);
      console.log(imageUrl);
      console.log("im here in catch");
      if (e.name === "ValidationError") {
        res
          .status(VALIDATION_ERROR_CODE)
          .send({ message: "Validation is incorrect ", e });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: "Error from createItem" });
      }
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
        .send({ message: "Error from getItems" });
    });
};

// commenting out for a little bit

// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageURL } = req.body;

//   ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
//     .orFail(() => {
//       const error = new Error("Item ID not found");
//       error.statusCode = 404;
//       throw error; // Remember to throw an error so .catch handles it instead of .then
//     })
//     .then((item) => {
//       res.status(200).send({ data: item });
//     })
//     .catch((e) => {
//       console.log(e.name);
//       res
//         .status(INTERNAL_SERVER_ERROR_CODE)
//         .send({ message: "Error from updateItem" });
//     });
// };

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
      console.log("im in then");
      res.status(200).send({ message: "successfully deleted" });
    })
    .catch((e) => {
      console.log(e.name);
      console.log(e);
      console.log("im in catch");
      if (e.name === "CastError") {
        res
          .status(CAST_ERROR_ERROR_CODE)
          .send({ message: "incorrect or _id or _id does not exist " });
      } else if (e.statusCode === NOT_FOUND_ERROR_CODE) {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "_id was not found or does not exist" });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: "Error from deleteItem" });
      }
    });
};

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((doc) => {
      if (doc === null) {
        const error = new Error("Item ID not found");
        error.statusCode = NOT_FOUND_ERROR_CODE;
        throw error;
      } else {
        console.log(doc);
        res.status(200).send({ doc });
      }
    })
    .catch((e) => {
      console.log("im in catch for likeItem");
      console.log(e);
      console.log(e.name);
      console.log(e.statusCode);
      if (e.name === "CastError") {
        res
          .status(VALIDATION_ERROR_CODE)
          .send({ message: "property was not found", e });
      } else if (e.statusCode === NOT_FOUND_ERROR_CODE) {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Item ID was not found", e });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: "something happened" });
      }
    });

const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((doc) => {
      if (doc === null) {
        const error = new Error("Item ID not found");
        error.statusCode = NOT_FOUND_ERROR_CODE;
        throw error;
      } else {
        res.status(200).send({ doc });
      }
    })
    .catch((e) => {
      console.log("im in catch for dislikeItem");
      console.log(e);
      console.log(e.name);
      if (e.name === "CastError") {
        res
          .status(VALIDATION_ERROR_CODE)
          .send({ message: "property was not found", e });
      } else if (e.statusCode === NOT_FOUND_ERROR_CODE) {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Item ID was not found", e });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: "something happened" });
      }
    });
// ...

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};

// updateItem,
