import {Router} from 'express';
import {
    editUserProfile,
    register,
    editUserAccount,
    getOtherProfile,
    search,
} from '#userController';
// import { postToWall } from '#postController'
import {verify} from '#authenticator';

const userRouter = Router();

userRouter.route('/editProfile').put(editUserProfile);

userRouter.route('/editAccount').put(verify, editUserAccount);

userRouter.route('/register').post(register);

userRouter.route('/:userName').get(getOtherProfile);

userRouter.route('/searchUsers').post(search);

export default userRouter;
