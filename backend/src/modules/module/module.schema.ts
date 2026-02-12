import mongoose, { Schema, Document } from "mongoose";

export interface IModule extends Document {
  course: mongoose.Types.ObjectId;
  title: string;
  order: number;
  isFreePreview: boolean;
}

const moduleSchema = new Schema<IModule>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    order: { type: Number, required: true },
    isFreePreview: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ModuleModel = mongoose.model<IModule>("Module", moduleSchema);