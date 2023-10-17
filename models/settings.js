import mongoose from "mongoose";
const { Schema } = mongoose;
const settingSchema = new Schema(
  {
    image: {
      type: String,
    },
    siteSubtitle: {
      type: String,
      trim: true,
    },
    siteTitle: {
      type: String,
      trim: true,
    },
    Redirect_url:{
      type:String
    },
    Poster_link:{
      type:String
    }
  },
  { timestamps: true }
);
export default mongoose.model("Setting", settingSchema);
