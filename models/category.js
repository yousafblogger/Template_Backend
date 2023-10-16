const mongoose = require("mongoose");
const { Schema } = mongoose;
const CategorySchema = new Schema(
  {
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
