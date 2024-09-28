import {Schema, model} from 'mongoose';

const sessionStoreSchema = new Schema({
    _id: {type: String},
    session: {type: String},
});

const SessionStore = model('SessionStore', sessionStoreSchema);
export default SessionStore;
