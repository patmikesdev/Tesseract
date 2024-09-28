import {model, Schema} from 'mongoose';
import {createHash, randomBytes} from 'crypto';

let accountSchema = new Schema({
    userName: {type: String, required: true, index: true, unique: true},
    passwordHash: {type: String, required: true},
    salt: {type: String, required: true, default: 'salt'},
    email: {type: String, required: true, index: true, unique: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
});

accountSchema.pre('validate', function (next) {
    //problem was it was initially reHashing the password Hash every time some other facet of the account got updated
    //had trouble getting this to be simple but finally got it, didn't want to include separate field for password in schema
    if (this.isNew || this.isModified('passwordHash')) {
        // console.log('NEW PW HASH')
        this.salt = randomBytes(12, (err, buf) => {
            if (err) throw err;
            this.salt = buf.toString('hex');
            //think it is important to start with a fresh hash each time, only way to be able to check pw?
            this.passwordHash = createHash('sha512')
                .update(this.salt + this.passwordHash, 'utf8')
                .digest('hex');
            next();
        });
    } else {
        next();
    }
});

//note to self later, importing this model does NOT establish a mongoose connection by default
//but it does establish a separate connection upon the actual mongoose connection
export const Account = model('Account', accountSchema);

export function buildAccountSeed(list) {
    let accounts = [];
    for (let [name, id] of Object.entries(list)) {
        let names = name.split(' ');
        accounts.push({
            _id: id,
            userName: `${names[0][0].toLowerCase()}${names[names.length - 1]}`,
            email: `${names[0][0].toLowerCase()}${names[names.length - 1]}@gmail.com`,
            passwordHash: names[names.length - 1].toLowerCase(),
            user: id,
        });
    }
    return accounts;
}
