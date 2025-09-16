import mongoose, {Schema} from "mongoose";

const likeSchema =new Schema(
    {
            viedo: {
                type: Schema.Types.ObjectId,
                ref: "Video"
            },
             comment: {
                type: Schema.Types.ObjectId,
                ref: "Comment"
            },
            tweet: {
                type: Schema.Types.ObjectId,
                ref: "tweet"
            },
            linkedBy: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            

        },{timestamps: true}
    )

export const Like = mongoose.model("Like",likeSchema)