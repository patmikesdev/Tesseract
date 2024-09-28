import {Store} from 'express-session';
import SessionStore from '#sessionModel';
import {User} from '#userModel';
// import { Types } from 'mongoose'
// import uid from 'uid-safe'

export class MongooseStore extends Store {
    constructor() {
        super();
    }
    //REQUIRED
    get(sid, callback) {
        SessionStore.findById(sid)
            .lean()
            .then((serialized) => {
                let session = serialized
                    ? JSON.parse(serialized.session)
                    : null;
                //takes serialized instance of User model (had been converted to plain object), turns it back into full mongoose model instance
                // if (session) { session.user = User.hydrate(session.user) }
                if (session && session.user) {
                    session.user = User.hydrate(session.user);
                }
                return callback
                    ? callback(null, session)
                    : session;
            })
            .catch((e) => callback(e, null));
    }
    //REQUIRED
    set(sid, session, callback) {
        let serialized = JSON.stringify(session);
        // this.all()
        SessionStore.updateOne(
            {_id: sid}, //find stored session, if present
            {
                _id: sid,
                session: serialized, //will come from setting some property on req.session at some point
            },
            {
                upsert: true, //creates the session if one for {_id:sid} not present
            }
        )
            .then((r) => (callback
                ? callback(null, r)
                : r))
            .catch((e) => callback(e));
    }
    //REQUIRED
    destroy(sid, callback) {
        // debugger
        SessionStore.findByIdAndRemove(sid)
            .then(() => callback(null))
            .catch((e) => callback(e));
    }

    //OPTIONAL
    all(callback) {
        debugger;
        SessionStore.find()
            .lean()
            .then((r) => {
                debugger;
                callback(null, r);
            })
            .catch((e) => {
                debugger;
                callback(e, null);
            });
    }

    //OPTIONAL
    clear(callback) {
        debugger;
        SessionStore.deleteMany()
            .then((r) => callback(null))
            .catch((e) => callback(e));
    }
    //OPTIONAL
    length(callback) {
        debugger;
        SessionStore.count()
            .then((l) => callback(null, l))
            .catch((e) => callback(e, null));
    }
    //OPTIONAL - RECOMMENDED, has not been tested thoroughly yet
    touch(sid, session, callback) {
        // debugger;
        SessionStore.findById(sid)
            .then((current) => {
                if (current) {
                    current.cookie = session.cookie;
                    this.set(sid, session);
                }
            })
            .then((r) => (callback
                ? callback(null, r)
                : r))
            .catch((e) => callback(e));
    }
}
