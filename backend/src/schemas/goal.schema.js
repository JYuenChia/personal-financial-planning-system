const { z } = require("zod");
const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    target_amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    current_amount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    target_date: {
      type: Date,
      required: true,
    },
    risk_appetite: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const goalCreateSchema = z.object({
  user_id: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1).max(200),
  target_amount: z.coerce.number().finite().positive(),
  current_amount: z.coerce.number().finite().min(0).optional(),
  target_date: z.coerce.date(),
  risk_appetite: z.coerce.number().int().min(1).max(5),
});

const goalUpdateSchema = goalCreateSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

module.exports = {
  goalSchema,
  goalCreateSchema,
  goalUpdateSchema,
};