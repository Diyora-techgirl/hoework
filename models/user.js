const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      console.log("Hashing password...");
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      console.log(`Hashed Password: ${this.password}`);
    } catch (error) {
      console.error("Error hashing password:", error);
      return next(error);
    }
  }
  next();
});


userSchema.methods.comparePassword = async function (password) {
  const match = await bcrypt.compare(password, this.password);
  console.log(`Password Match: ${match}`); // Debugging log
  return match;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
