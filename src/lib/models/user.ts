import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      unique:true,
      required:true
    },
    first_name: {
      trim: true,
      type: String,
      required: [true, "please enter first name"],
      minlength: [3, "first name shouldn't be less than 3 characters"],
    },
    last_name: {
      trim: true,
      type: String,
      required: [true, "please enter last name"],
      minlength: [3, "last name shouldn't be less than 3 characters"],
    },
    image_url:{
        type:String,
    },
    email: {
      trim: true,
      type: String,
      required: [true, "please enter email address"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please Provide a valid email",
      ],
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("user", userSchema);
export default User;
