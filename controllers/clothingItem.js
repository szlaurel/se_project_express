const mongoose = require("mongoose");
// const { findOneAndDelete } = require("../models/clothingitem");
const ClothingItem = require("../models/clothingitem");
const {
  NOT_FOUND_ERROR_CODE,
  FORBIDDEN_ERROR_CODE,
} = require("../utils/errors");

const { BadRequestError } = require("../errors/BadRequestError");
const { ForbiddenError } = require("../errors/ForbiddenError");
const { NotFoundError } = require("../errors/NotFoundError");

// need to check if the error handling on this is correct in createItem
// and need to see if this is how youre supposed to do it

const createItem = (req, res, next) => {
  console.log(req);
  console.log(req.body);

  const owner = req.user._id;

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner })
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
        console.error(e);
        next(new BadRequestError("Error validation occurred"));
      } else {
        next(e);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((e) => {
      console.log(e.name);
      next(e);
    });
};

// commenting out for a little bit

// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageURL } = req.body;

//   console.log(req);

//   ClothingItem.findByOneAndUpdate(itemId, { $set: { imageURL } })
//     .orFail(() => {
//       const error = new Error("Item ID not found");
//       error.statusCode = 404;
//       throw error; // Remember to throw an error so .catch handles it instead of .then
//     })
//     .then((item) => {
//       res.status(200).send({ data: item });
//     })
//     .catch((e) => {
//       console.log("im in catch for updateItem");
//       console.log(e);
//       console.log(e.name);
//       console.log(e.statusCode);
//       if (e.name === "CastError") {
//         res
//           .status(VALIDATION_ERROR_CODE)
//           .send({ message: "property was not found" });
//       } else if (e.statusCode === NOT_FOUND_ERROR_CODE) {
//         res
//           .status(NOT_FOUND_ERROR_CODE)
//           .send({ message: "Item ID was not found" });
//       } else {
//         res
//           .status(INTERNAL_SERVER_ERROR_CODE)
//           .send({ message: "Error occurred in updateItem" });
//       }
//     });
// };

// need to still find out how to get the item owners _id for the delete card

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  // console.log(req);
  console.log(itemId, "this right here is the item Id");
  console.log(userId, "this is the userId ");

  ClothingItem.findById(itemId)
    .then((card) => {
      // the if card null statement is new to the code due to the reviewer
      if (card === null) {
        throw new NotFoundError("_id was not found or does not exist");
      }
      if (card.owner.equals(userId)) {
        // check if current user owns the cards
        // req.user._id, and card.owner
        // if so, delete the card
        console.log(card.owner, "I AM HERE");
        return ClothingItem.findByIdAndDelete(itemId).then(() => {
          res.send({ message: "Delete" });
        });
      }
      console.log(card.owner, "this is the card owner");
      console.log(new mongoose.Types.ObjectId(userId), "this is the userId");
      console.log("something bad shouldve happened here");
      throw new Error("the owner ids dont match");
    })
    .catch((e) => {
      console.log(e);
      console.log("im in catch");
      console.log(e.name);
      console.log(e.message);
      if (e.name === "CastError") {
        next(new BadRequestError("incorrect or _id or _id does not exist"));
      } else if (e.message === "the owner ids dont match") {
        next(new ForbiddenError("ids do not match"));
      } else if (e.statusCode === NOT_FOUND_ERROR_CODE) {
        next(new NotFoundError("_id was not found or does not exist"));
      } else if (e.statusCode === FORBIDDEN_ERROR_CODE) {
        next(new ForbiddenError("you do not have access to this content"));
      } else {
        next(e);
      }
    });

  // ClothingItem.findByIdAndDelete(itemId)
  // .orFail(() => {
  //   if (!itemId) {
  //     const error = new Error("Item ID not found");
  //     error.statusCode = NOT_FOUND_ERROR_CODE;
  //     throw error;
  //   }
  // })
  // .then((data) => {
  //   console.log("im in then for delete item");
  //   console.log(data);
  //   if (userId === userId) {
  //     res.status(200).send({ message: "successfully deleted" });
  //   } else if (itemId == null) {
  //     throw error;
  //   } else {
  //     orFail(() => {
  //       const error = new Error("Id's dont match");
  //       error.statusCode = FORBIDDEN_ERROR_CODE;
  //       throw error;
  //     });
  //   }
  // })
  // .catch((e) => {
  //   console.log(e);
  //   console.log("im in catch");
  //   if (e.name === "CastError") {
  //     res
  //       .status(CAST_ERROR_ERROR_CODE)
  //       .send({ message: "incorrect or _id or _id does not exist " });
  //   } else if (e.statusCode === NOT_FOUND_ERROR_CODE) {
  //     res
  //       .status(NOT_FOUND_ERROR_CODE)
  //       .send({ message: "_id was not found or does not exist" });
  //   } else if (e.statusCode === FORBIDDEN_ERROR_CODE) {
  //     res
  //       .status(FORBIDDEN_ERROR_CODE)
  //       .send({ message: "you do not have access to this content" });
  //   } else {
  //     res
  //       .status(INTERNAL_SERVER_ERROR_CODE)
  //       .send({ message: "Error from deleteItem" });
  //   }
  // });
};

const likeItem = (req, res, next) =>
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
        next(new BadRequestError("property was not found"));
      } else if (e.statusCode === NOT_FOUND_ERROR_CODE) {
        next(new NotFoundError("Item ID was not found"));
      } else {
        next(e);
      }
    });

const dislikeItem = (req, res, next) =>
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
        next(new BadRequestError("property was not found"));
      } else if (e.statusCode === NOT_FOUND_ERROR_CODE) {
        next(new NotFoundError("Item ID was not found"));
      } else {
        next(e);
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
