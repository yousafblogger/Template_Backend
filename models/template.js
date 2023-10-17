import mongoose from "mongoose";
const { Schema } = mongoose;

const TemplateSchema = new Schema(
  {
    Template_Name: {
      type: String,
      trim: true,
    },
    Template_ID: {
      type: String,
      trim: true,
    },
    video_link: {
      type: String,
    },
    poster_link: {
      type: String,
    },
    category:[ {
      type: Schema.Types.ObjectId,
      ref: "Category",
    }],
    Usage_detail: {
      type: String,
    },
    Creater_name: {
      type: String,
    }, 
    Clips: {
      type: String,
    },
    Creater_desc: {
      type: String,
    },
    Tags: {
      type: String,
    },
    sequence: {
      type: Number,
      trim: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Template", TemplateSchema);
