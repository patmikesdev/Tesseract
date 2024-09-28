//NEEDS OVERHAUL, LOTS OF REDUNDANT QUERIES WHEN I ALREADY HAVE REQ.SESSION.USER HYDRATED

import { createHash } from 'crypto';
import multiparty from 'multiparty';
import {Account} from '#accountModel';
import {User} from '#userModel';
import {getProfile} from '#userController';
//multiplayer demonstration purposes only
import cookie from 'cookie';
import signature from 'cookie-signature';
import config from '#config';
const {secret, sessionName, options} = config.cookie;

export function login(req, res, next) {
    let {email, password} = req.body;
    Account.findOne({email: email})
        .populate({path: 'user'})
        .then((acc) => {
            if (acc) {
                let input = password,
                    salt = acc.salt;
                let hashedInput = createHash('sha512')
                    .update(salt + input, 'utf8')
                    .digest('hex');
                if (hashedInput === acc.passwordHash) {
                    //have already populated the user path!
                    let user = acc.user;
                    user.status = true;
                    user.save()
                        .then(() => getProfile(acc._id)) //think I can streamline this a lot (has redundant query to User.findByID), just need to populate user.profile and get formatted UserData, 
                        .then((formattedUserData) => {
                            req.session.user = user;
                            //For demonstrating multiple users on one screen, need to obtain copy of cookie value that's sent to front end
                            if (req.headers['multiplayer-login'] === 'true') {
                                let dupedCookie = duplicateCookie(
                                    req.session.id
                                );
                                res.set('multiplayer-protocol', dupedCookie);
                                // debugger;
                            }
                            //spreading formattedUserData.account so that email and userName are treated as top level fields of player Data on front end, same thing done in getUser()
                            res.json({
                                success: true,
                                msg: 'SUCCESS',
                                user: {
                                    ...formattedUserData,
                                    ...formattedUserData.account,
                                },
                            });
                        });
                } else {
                    // res.json({success: false, msg: "You Entered an Invalid password"})
                    res.status(403).send(
                        'The Password you entered was invalid.'
                    );
                }
            } else {
                res.status(404).send('The Address you entered was invalid.');
                // res.json({ success: false, msg: "The Address you entered was invalid" })
            }
        })
        .catch((e) => {
            res.status(500).send(e.message);
            // res.json({ success: false, msg: "Error Caught" })
        });
}

export function logout(req, res) {
    User.findByIdAndUpdate(
        req.session.user._id,
        {status: false},
        {new: true}
    ).then((r) => {
        //HAVE to wait for findAndUpdate to finish before responding
        req.session = null;
        res.clearCookie('tesseractSession');
        res.end();
    });
}

export function getUser(req, res) {
    if (req.session.user) { //will be much better way of doing this without extra query when I've already hydrated req.session.user
        //UNDER DEVELOPMENT, getProfile2(req.session.user)
        getProfile(req.session.user._id).then((user) => {
            res.json({user: {...user, ...user.account}});
        });
    } else {
        res.json({user: null});
    }
}

//used when editing Account info only
export function verify(req, res, next) {
    let form = new multiparty.Form();
    form.parse(req, (err, fields) => {
        Account.findById(req.session.user.account).then((acc) => {
            debugger;
            let input = fields.verify,
                salt = acc.salt;
            let hashedInput = createHash('sha512')
                .update(salt + input, 'utf8')
                .digest('hex');
            if (hashedInput === acc.passwordHash) {
                req.formFields = fields;
                req.account = acc;
                next();
            } else {
                res.json({success: false, msg: 'Invalid Password'});
            }
        });
    });
}

//helper function for multiplayer demonstration
function duplicateCookie(val) {
    //following procedure copied from setCookie() function used by express-session package, index.js line 655
    //serializing performs the uri encoding and also appends extra information
    let signed = 's:' + signature.sign(val, secret);
    return cookie.serialize(sessionName, signed, options);

    //version that ALSO worked
    // return `${sessionName}=${encodeURIComponent('s:' + signature.sign(val, secret))}`
}
