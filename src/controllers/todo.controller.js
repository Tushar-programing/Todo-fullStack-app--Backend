import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Todo } from "../models/todo.model.js";

const getTodo = asyncHandler(async(req, res) => {
    const owner = req.user._id;
    console.log(owner);

    if (!owner) {
        throw new ApiError(400, "owner fields is required")
    }
    // console.log("first 1");
    const todo = await Todo.find({
        owner,
    })
    // console.log("first 2");

    if (!todo) {
        throw new ApiError(400, "there is no todo available")
    }
    
    // console.log("first 3");
    return res
    .status(200)
    .json(new ApiResponse(200, todo,  'Successfully got the playlist.'))

})

const createTodo = asyncHandler(async(req, res) => {
    const {content, complete} = req.body;

    const owner = req.user._id;
    // console.log(content, complete, owner);

    if (!content || !owner) {
        throw new ApiError(400, "Missing required fields");
    };

    if (!((complete === true) || (complete === false))) {
        throw new ApiError(400, "Missing complete value")
    }

    const todo = await Todo.create({
        content,
        complete,
        owner,
    })

    if (!todo) {
        throw new ApiError(400, "unable to create todo")
    };

    return  res
    .status(200)
    .json(new ApiResponse(200, todo, "todo created successfully"))
})

const deleteTodo = asyncHandler(async(req, res) => {
    const {id} = req.params;
    // console.log(id);

    if (!id) {
        throw new ApiError(400, "no todo id found")
    }

    const del = await Todo.findByIdAndDelete(id);

    if (!del) {
        throw new ApiError(400, "unable to  delete Todo")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "successfully delete todo"))
})

const updateComplete = asyncHandler(async(req, res) => {
    const {complete} = req.body;
    const {id} = req.params;

    if (!id) {
        throw new ApiError(400, "missing todo id")
    }

    if (!((complete === true) || (complete === false))) {
        throw new ApiError(400, "Missing complete value")
    }

    const update = await Todo.findByIdAndUpdate(
        id,
        {
            $set:{
                complete,
            }
        },
        {new: true}
    )

    if (!update) {
        throw new ApiError(400, "unable to update todo")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, update, "todo updated successfully"));
})

const updateContent = asyncHandler(async(req, res) => {
    const {content} = req.body;
    const {id} = req.params;
    // console.log(content, id);

    if (!content || !id) {
        throw new ApiError(400, "Invalid data")
    }

    const update = await Todo.findByIdAndUpdate(
        id,
        {
            $set: {
                content,
            }
        },
        {new: true}
    )

    if (!update) {
        throw new ApiError(400, "unable to update content")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, update, "content has been updated"))
})

export {
    getTodo,
    createTodo,
    updateComplete,
    updateContent,
    deleteTodo,
}