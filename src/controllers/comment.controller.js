import mongoose, { isValidObjectId, Mongoose } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { useReducer } from "react"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video ID");
    }

    const comments = await Comment.aggregatePaginate(
        Comment.aggregate([
            {
                $match: {
                    video: new Mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",

                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                fullName: 1,
                                avatar: 1
                            }
                        },
                    ],
                },
            },
            {
                $addFields : {
                    owner :{
                        $first : "$owner"
                    }
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            { page,limit }
        ])
    )
    return res
    .status(200)
    .json(new ApiResponse(200, "Comments fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const { content } = req.body

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video ID");
    }
    if(!content?.trim()){
        throw new ApiError(400, "Comment content is required");
    }

    const comment = Comment.create({
        content,
        video : videoId,
        owner : req.user._id,
    });
    return req
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params;
    const { content } = req.body;
    if(!isValidObjectId(commentId)){
        throw new ApiError(401, "Invalid commentId")
    }

    if(!content?.trim()){
        throw new ApiError(401,"Comment content is required");
    }

    const updatedComment = Comment.findOneAndUpdate(
        {
            _id: commentId, 
            owner: req.user._id 
        },
        { $set: {content}},
        {new: true}
    )

    if(!updateComment){
        throw new ApiError(404, "Comment not found or not authorized")
    }

    return res 
    .status(200)
    .json(new ApiResponse(200,updatedComment, "Cmment updated successfully"))

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const commentId = req.params

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment Id")
    }
    
    const deleted = await Comment.findOneAndDelete(
        {
            _id: commentId,
           owner: req.user._id,
        }
    )

     if (!deleted) {
    throw new ApiError(404, "Comment not found or not authorized to delete");
  }

  return res
  .status(200)
  .json(200, {},"Comment deleted Successfully")
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }