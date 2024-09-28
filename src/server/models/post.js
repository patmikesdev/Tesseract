import {Schema, model} from 'mongoose';

const schema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    text: String,
    timeStamp: {type: Date, default: Date.now()},
    //array for comments to this post, just a wall again?
});

export const Post = model('Post', schema);
