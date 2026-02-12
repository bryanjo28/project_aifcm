import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  level: "beginner" | "intermediate" | "advanced";
  isPublished: boolean;
  price?: number;
  createdBy: mongoose.Types.ObjectId;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    thumbnail: String,
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    isPublished: { type: Boolean, default: false },
    price: Number,
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const CourseModel = mongoose.model<ICourse>("Course", courseSchema);
