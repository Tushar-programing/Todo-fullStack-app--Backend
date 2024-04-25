import mongoose, { Schema } from "mongoose";


const todoSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            required: true,
        },
        complete: {
            type: Boolean,
            required: true,
        }
    }
)

export const Todo = mongoose.model("Todo", todoSchema)