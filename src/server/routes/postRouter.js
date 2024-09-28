import {Router} from 'express';
import {postToWall, deletePost} from '#postController';

const postRouter = Router();

postRouter.route('/postToWall').post(postToWall);

postRouter.route('/deletePost/:postId').delete(deletePost);

export default postRouter;
