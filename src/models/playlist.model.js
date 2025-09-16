import mongoose, {Schema} from "mongoose";

const playlistSchema = new Schema(
    {
        name: {
            tyep: String,
            req: true
        },
        description: {
            tyep: String,
            req: true
        },
        video: [
            {
            type: Schema.Types.ObjectId,
            ref: "Video"
           }
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    },{timestamps: true})

export const PlayList = mongoose.model("PlayList",playlistSchema)