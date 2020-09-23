const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User schema
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: String,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("User", UserSchema);

module.exports = Users;
