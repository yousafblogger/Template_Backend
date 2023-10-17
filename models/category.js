const mongoose = require("mongoose");
const { Schema } = mongoose;
const crypto = require('crypto');
// function generateShortId() {
//   const shortId = new mongoose.mongo.ObjectId().toString().slice(0,10);
//   const id =`new ObjectId("${shortId}")`
//   console.log(id);
//   return shortId;
// }
const CategorySchema = new Schema(
  {
  //  _id: {
  //     type: mongoose.mongo.ObjectId,
  //     default:generateShortId(),
  //     required: true,
  //   },
    name: {
      type: String,
      trim: true,
      required: true,
    },
   sequence: {
      type: Number,
      trim: true,
      required: true,
    },
    status: {
      type:Boolean,
      default:true,
    },
    Template_Count: {
      type: Number,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Category", CategorySchema);
