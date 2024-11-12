const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const UserSchema = new Schema(
  {
    username: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
    books:[
        {
            title: {
                type: String,
            },
            author: {
                type: String,
            },
            totalpages: {
                type: String,
            },
            pagesread: {
                type: String,
                default: 0,
            },
            twitterlink: {
                type: String,
            },
            bookimage: {
              type: String,
            },
            genre: {
              type: String, 
            },
        }
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
    return;
  }
  user.password = await bcrypt.hash(user.password, 8);
  next();
});


UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Generates a profile by removing sensitive information
UserSchema.methods.getPublicProfile = function () {
  const user = this.toObject();
  delete user["password"];
  delete user["tokens"];
  return user;
};

UserSchema.statics.findByCredentials = async ({ username, password }) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error(
      "Sorry the credentials you entered do not match. Please try again."
    );
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error(
      "Sorry the credentials you entered do not match. Please try again."
    );
  }
  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;