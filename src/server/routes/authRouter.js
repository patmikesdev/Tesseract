import {Router} from 'express';
import {
    login,
    logout,
    getUser /*getUser_allowMultiples*/,
} from '#authenticator';

const authRouter = Router();

authRouter.route('/login').post(login);

authRouter.route('/logout').get(logout);

authRouter.route('/currentUser').get(getUser);

//to allow multiple users logged in to same browser, essentially bypasses express sessions, useful for demonstration and dev only
// authRouter
//     .route('/currentUser_allowMultiples/:userName')
//     .get(getUser_allowMultiples)

// authRouter
//     .route('/accountInfo')
//     .get(getAccountInfo);

export default authRouter;
