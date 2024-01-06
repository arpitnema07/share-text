import mongoose from "mongoose";

const Schema = mongoose.Schema;

const textSchema = new Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);
export default mongoose.model("Text", textSchema);
