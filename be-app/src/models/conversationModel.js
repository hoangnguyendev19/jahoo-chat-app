const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    admin: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    type: {
      type: String,
      enum: ["GROUP", "FRIEND"],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

// conversationSchema.virtual("conversationUser", {
//   ref: "User",
//   localField: "_id",
//   foreignField: "conversation",
//   justOne: false,
// });

const Conversation = mongoose.model("conversation", conversationSchema);

module.exports = Conversation;
