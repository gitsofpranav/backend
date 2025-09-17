import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body
    if(!content){
        throw ApiError(401, "Tweet content is required")
    }

    const tweet = await Tweet.create({
        content: content,
        owner: req.user._id,
    })

    return res
    .status(201)
    .json(ApiResponse(201,"Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const user = await User.findById(req.user._id);
    if(!user){
        throw ApiError(401,"Unauthorized User");
    }

    const tweet = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(user._id)
            }
        },
        {
            $lookup: {
                from: "user",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {

                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        },

        {
            $sort: {
                createdAt: -1
            }
        }, {
            $project: {
                content: 1,
                owner: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
        
    ])

    if(!tweet.length){
        return res
        .status(200)
        .json(new ApiResponse(200, [],"No tweets found for this user"))
    }

    return res 
    .status(200)
    .json(ApiError(200, [],"User tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const user = await User.findById(req.user._id);
    if(!user){
        throw new ApiError(401, "Unauthorized user")
    }

    const { tweetId,content } = req.body
    if(!tweetId || !content){
        throw new ApiError(400, "Tweet ID and content are required")
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID");
    }


    const updatedTweet = await Tweet.findByIdAndUpdate(
        {
            _id:tweetId,owner: user._id
        },
        {
            $set: {
                content: content
            }
        },
        {
            new: true
        }
    )

    if(!updateTweet){
        throw new ApiError(404,"Tweet not found or not authorized")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,updateTweet,"Tweet updated successfully"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const user =  await User.findById(req.user._id)
    if(!user){
        throw ApiError(401, "Unauthorized user")
    }

    const { tweetId } = req.body

    if(!tweetId){
        throw new ApiError(400, "Tweet is required")
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID");
    }
    
    const tweet = await Tweet.findOne({
        _id: tweetId,
        owner: user._id
    })

    if(!tweet){
        throw new ApiError(404, "Tweet not found or you are not authorized to delete this tweet")
    }

    await Tweet.deleteOne({
        _id: tweetId,
        owner: user._id
    })
    return res 
    .status(200)
    .json(new ApiResponse(200, {}, "tweet deleted successfully"))

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}