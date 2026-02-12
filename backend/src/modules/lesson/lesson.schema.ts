import mongoose, { Schema, Document } from "mongoose";

export interface ILesson extends Document {
  module: mongoose.Types.ObjectId;
  title: string;
  contentType: "video" | "article" | "quiz";
  videoUrl?: string;
  textContent?: string;
  duration?: number;
  order: number;
  isPreview: boolean;
}

const lessonSchema = new Schema<ILesson>(
  {
    module: { type: Schema.Types.ObjectId, ref: "Module", required: true },
    title: { type: String, required: true },
    contentType: {
      type: String,
      enum: ["video", "article", "quiz"],
      required: true,
    },
    videoUrl: String,
    textContent: String,
    duration: Number,
    order: { type: Number, required: true },
    isPreview: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const LessonModel = mongoose.model<ILesson>("Lesson", lessonSchema);
