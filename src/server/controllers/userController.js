//NEEDS OVERHAUL, LOTS OF REDUNDANT QUERIES WHEN I ALREADY HAVE REQ.SESSION.USER HYDRATED

import { readFileSync } from 'fs';
import {extname} from 'path';
import {Account} from '#accountModel';
import {User} from '#userModel';
import {getWallData} from '#postController';
//needed temporarily here to actually register the model with mongoose
// import { Post } from '#postModel'
import multiparty from 'multiparty';
import mongoose from 'mongoose';

export function editUserProfile(req, res, next) {
    let form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        //here fields only contains items used in profile, not in account
        for (let prop in fields) {
            // console.log(prop,  fields[prop][0], (typeof fields[prop][0]))
            req.session.user.profile[prop] = fields[prop][0];
        }
        if (files.pic[0].size > 0) {
            //size > 0 indicates an actual file was uploaded as input
            //files.pic[0].path is the path to a temporary file in the system
            //readFileSync w/o encoding returns a buffer, is what I want to store in DB
            //picFileExt used in constructing data URL to display the image, see components/Profile/ProfileLeft.jsx line 11
            //<Image src={`data:image/${user.profile.picFileExt};base64,${user.profile.pic}`} rounded fluid className="border border-dark" style={{maxHeight: '320px'}}></Image>
            req.session.user.profile.pic = readFileSync(files.pic[0].path);
            req.session.user.profile.picFileExt = extname(
                files.pic[0].originalFilename
            ).slice(1);
        }
        req.session.user
            .save()
            .then(() => res.json({user: req.session.user.toObject()}));
    });
}

export function register(req, res) {
    let id = new mongoose.Types.ObjectId();
    let form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        Account.create({
            _id: id,
            userName: fields.userName[0],
            email: fields.email[0],
            passwordHash: fields.password[0],
            user: id,
        })
            .then((acc) => {
                return User.create({
                    _id: id,
                    profile: {
                        name: fields.name
                            ? fields.name[0]
                            : null,
                        dob: fields.dob
                            ? fields.dob[0]
                            : null,
                        field: fields.field
                            ? fields.field[0]
                            : null,
                        gender: fields.gender
                            ? fields.gender[0]
                            : null,
                        theme: fields.theme
                            ? fields.theme[0]
                            : null,
                        nobel: fields.nobel
                            ? fields.nobel[0]
                            : null,
                        accolades: fields.accolades
                            ? fields.accolades[0]
                            : null,
                        bio: fields.bio
                            ? fields.bio[0]
                            : null,
                        location: fields.location
                            ? fields.location[0]
                            : null,
                        pic: files.pic
                            ? readFileSync(files.pic[0].path)
                            : null,
                        picFileExt: files.pic
                            ? extname(files.pic[0].originalFilename).slice(1)
                            : null,
                    },
                    account: id, //need to verify this works correctly mongo id vs mongoose Schema type,
                    name: fields.name[0],
                });
                //only used in dev,
                // Account.findByIdAndRemove(acc._id)
            })
            .then(() => {
                res.json({msg: 'New User created', success: true});
            })
            .catch((e) => {
                res.json({msg: e.message, success: false});
            });
    });
}

export function editUserAccount(req, res) {
    //gets called after verify() in middleware chain, req.formFields was added there, already processed formData
    //also added req.account is correct mongoose model instance for the current user
    req.account.email = req.formFields.email[0];
    req.account.userName = req.formFields.userName[0];
    // debugger;
    if (req.formFields.password[0]) {
        req.account.passwordHash = req.formFields.password[0];
    }
    // debugger;
    req.account
        .save()
        .then((r) => {
            // debugger
            res.json({
                success: true,
                data: {
                    userName: req.account.userName,
                    email: req.account.email,
                },
            });
        })
        .catch((e) => {
            res.json({success: false});
        });
}

export function getOtherProfile(req, res) {
    getProfile(null, req.params.userName).then((user) => {
        // debugger;
        if (user) {
            res.json({data: {...user, ...user.account}});
        } else {
            res.json({data: 404});
        }
    });
}

export function getProfile(id, userName) {
    return (
        // (id ? User.findById(id) : User.findOne({ 'account.userName': userName })) //can't query by account.userName, because account is a separate object that has to be populated
        (
            id
                ? User.findById(id)
                    .populate({path: 'account', select: 'email userName'})
                    .populate({
                        path: 'profileWall',
                        options: {sort: '-timeStamp'},
                    })
                    .lean()
                : Account.findOne({userName})
                    .populate({
                        path: 'user',
                        populate: {
                            path: 'profileWall',
                            options: {sort: '-timeStamp'},
                        },
                        // populate: { path: 'account', select: 'email userName' }, HAVE TO PUT THIS IN SEPARATE .populate() CALL
                    })
                    .populate({
                        path: 'user',
                        populate: {
                            path: 'account',
                            select: 'email userName',
                        },
                    })
                    .select('user')
                    .lean()
                //returns an object with a user field, not the user object itself, which is needed format
                    .then((acc) => {
                        return acc
                            ? acc.user
                            : null;
                    })
        ).then((user) => {
            //get data for people who've posted on this profile wall without transferring extra copies of their profile pic
            if (!user) return null;
            return getWallData(user.profileWall).then((postAuthors) => {
                user.wallAuthors = postAuthors; //stores a map of unique authors on user object that gets sent to front end
                // debugger;
                return user;
            });
        })
    );
}

export function getProfile2(sessionUser) {
    //untested version, rewritten to account for fact that req.session.user is normally already populated so I don't need to perform an initial query
    let profileData;
    sessionUser
        .populate({ path: 'account', select: 'email userName' })
        .populate({
            path: 'profileWall',
            options: { sort: '-timeStamp' },
        })
        .lean()
        //original structure, 
        // .then((user) => {
        //get data for people who've posted on this profile wall without transferring extra copies of their profile pic
        // return getWallData(user.profileWall).then((postAuthors) => {
        //     user.wallAuthors = postAuthors; //stores a map of unique authors on user object that gets sent to front end
        //     return user;
        // });
        // })
        .then((user) => {
            profileData = user; 
            return getWallData(user.profileWall)
        })
        .then((postAuthors) => {
            profileData.wallAuthors = postAuthors; //stores a map of unique authors on user object that gets sent to front end
            return profileData;
        });
}

export function search(req, res) {
    //because profile is embedded subdoc within User, have to format search to accomadate
    //EG need to phrase like User.find({profile.location: "Jackson, MI", profile.gender: "Male"})
    let formattedUserQuery = {};
    for (let [k, v] of Object.entries(req.body.user.profile)) {
        formattedUserQuery[`profile.${k}`] = v;
    }
    //name and status are not part of profile, but just top level fields in User doc,
    if (req.body.user.name) formattedUserQuery.name = req.body.user.name;
    if (req.body.user.status) formattedUserQuery.status = req.body.user.status;

    //have to check if anything was searched for, otherwise ran an empty query that pulled in every user
    Promise.all([
        req.body.user
            ? User.find({...formattedUserQuery})
                .populate('account', 'userName email')
                .lean()
                .exec()
            : [],
        req.body.account
            ? Account.find({...req.body.account})
                .select('-passwordHash -salt')
                .populate('user', 'name profile status')
                .lean()
                .exec()
            : [],
    ]).then((results) => {
        let users = [];
        //results have different structures here because they queried different collections
        users = users.concat(
            results[0].map((el) => {
                return {
                    name: el.name,
                    profile: el.profile,
                    status: el.status,
                    ...el.account,
                };
            })
        );
        users = users.concat(
            results[1].map((el) => {
                return {userName: el.userName, email: el.email, ...el.user};
            })
        );
        //display online users first, then sort alphabetically by last name
        users.sort((a, b) => {
            if (a.status && !b.status) return -1;
            if (b.status && !a.status) return 1;
            let aSplit = a.name.split(' ');
            let bSplit = b.name.split(' ');
            return aSplit[aSplit.length - 1].localeCompare(
                bSplit[bSplit.length - 1]
            );
        });
        // debugger;
        res.json({data: users});
    });
}
