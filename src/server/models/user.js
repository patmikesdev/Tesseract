import {model, Schema} from 'mongoose';
import {readFileSync} from 'fs';
//part of initial seeding
import bios from '../database/seed/scripts/seedBios.js';

const profileSchema = new Schema({
    dob: {type: Date, required: true},
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Non-binary'],
    },
    location: {type: String},
    nobel: {type: Boolean, default: false},
    accolades: {type: String}, //come back l8r and make into an array
    field: {type: String},
    bio: {type: String},
    lastActivity: {type: Date, default: Date.now()},
    pic: {type: Buffer},
    picFileExt: {type: String, default: 'png'},
    theme: {type: String},
    //shapes??
});

const userSchema = new Schema({
    status: {type: Boolean, default: false},
    account: {type: Schema.Types.ObjectId, ref: 'Account'},
    // friendList: { type: Schema.Types.ObjectId, ref: 'FriendList' },
    profile: profileSchema,
    name: {type: String},
    profileWall: [{type: Schema.Types.ObjectId, ref: 'Post'}], //Arrays implicitly have a default value of `[]` (empty array).
});

export const User = model('User', userSchema);

//used for initial dev seeding
export function buildUserSeed(list) {
    let users = [];
    for (let [name, id] of Object.entries(list)) {
        users.push({
            _id: id,
            account: id,
            name: name,
        });
    }
    let einstein =
        users[users.findIndex((el) => el.name === 'Albert Einstein')];
    let maxwell =
        users[users.findIndex((el) => el.name === 'James Clerk Maxwell')];
    let wilczek = users[users.findIndex((el) => el.name === 'Frank Wilczek')];
    let turing = users[users.findIndex((el) => el.name === 'Alan Turing')];
    let franklin =
        users[users.findIndex((el) => el.name === 'Rosalind Franklin')];
    let noether = users[users.findIndex((el) => el.name === 'Emmy Noether')];

    einstein.profile = {
        dob: new Date(1879, 2, 14),
        gender: 'Male',
        nobel: true,
        field: 'Physics',
        bio: bios.einstein,
        pic: readFileSync('./database/seed/images/einstein.png'),
        location: 'Institute for Advanced Study in Princeton, New Jersey',
        theme: 'charcoal',
        // shapes: []
    };
    maxwell.profile = {
        dob: new Date(1831, 5, 13),
        gender: 'Male',
        nobel: true,
        field: 'Physics',
        bio: bios.maxwell,
        pic: readFileSync('./database/seed/images/maxwell.png'),
        location: "King's College, London, University of Cambridge",
        theme: 'default',
        // shapes: []
    };
    wilczek.profile = {
        dob: new Date(1951, 4, 15),
        gender: 'Male',
        nobel: true,
        field: 'Physics',
        bio: bios.wilczek,
        pic: readFileSync('./database/seed/images/wilczek.png'),
        location: 'MIT, Cambridge MA',
        theme: 'default',
        // shapes: []
    };
    turing.profile = {
        dob: new Date(1912, 5, 23),
        gender: 'Male',
        nobel: false,
        field: 'Computer Science',
        bio: bios.turing,
        pic: readFileSync('./database/seed/images/turing.png'),
        location: 'Princeton University, Victoria University of Manchester',
        theme: 'green',
        // shapes: []
    };
    franklin.profile = {
        dob: new Date(1920, 6, 15),
        gender: 'Female',
        nobel: false,
        field: 'Physical Chemistry',
        bio: bios.franklin,
        pic: readFileSync('./database/seed/images/franklin.png'),
        location: "University of London, King's College London",
        theme: 'default',
        // shapes: []
    };
    noether.profile = {
        dob: new Date(1882, 2, 23),
        gender: 'Female',
        nobel: false,
        field: 'Mathematics',
        bio: bios.noether,
        pic: readFileSync('./database/seed/images/noether.png'),
        location: 'University of Gottingen, Bryn Mawr College, PA',
        theme: 'violet',
        // shapes: []
    };

    return users;
}
