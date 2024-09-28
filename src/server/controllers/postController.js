import {Account} from '#accountModel';
import {User} from '#userModel';
import {Post} from '#postModel';

export function getWallData(profileWall) {
    //GOAL IS TO PROPERLY FORMAT DATA FOR DISPLAYING ALL WALL POSTS, BUT NOT SEND SAME IMAGE MULTIPLE TIMES IN CASE OF MULTIPLE POSTS BY THE SAME AUTHOR.
    //RETURNS A PROMISE THAT RESOLVES TO A MAP
    //All AUTHORS WHO POSTED ON THIS WALL WILL BE MEMBERS IN THAT MAP, INDEXED BY THEIR (string) ID, WHICH STORES THEIR DATA RELEVANT TO DISPLAYING A POST BY THEM (PIC, USERNAME ETC)
    let authorIds = new Set();
    for (let post of profileWall) {
        authorIds.add(post.author._id.toString());
    }
    return Promise.all([...authorIds].map((id) => getFormattedAuthor(id))).then(
        (authorsArray) => {
            // let formattedAuthors = new Map();
            let formattedAuthors = {};
            for (let author of authorsArray) {
                // formattedAuthors.set(author._id, author)
                formattedAuthors[author._id] = author;
            }
            return formattedAuthors;
        }
    );

    function getFormattedAuthor(id) {
        return User.findById(id)
            .populate({path: 'account', select: 'userName'})
            .select('profile.pic profile.picFileExt name account')
            .lean()
            .then((user) => {
                // debugger;
                return {
                    _id: user._id.toString(),
                    pic: user.profile.pic,
                    picFileExt: user.profile.picFileExt,
                    name: user.name,
                    userName: user.account.userName,
                };
            });
    }
}

export function postToWall(req, res) {
    //need to clean up how this works, still having trouble only getting desired fields back
    let {userName, text} = req.body;
    debugger;
    Promise.all([
        Account.findOne({userName})
            .populate({
                path: 'user',
                populate: 'profileWall',
            })
            .select('user'),
        Post.create({
            author: req.session.user._id,
            text,
            timeStamp: Date.now(),
        }),
    ])
        .then((r) => {
            r[0].user.profileWall.push(r[1]._id);
            return r[0].user.save();
        })
        .then((u) =>
            User.populate(u, {
                path: 'profileWall',
                options: {sort: '-timeStamp'},
            })
        )
        .then((u) => {
            res.json(u.toObject().profileWall);
        });
}

export function deletePost(req, res) {
    //don't need to populate profileWall to delete post by Id
    req.session.user.profileWall = req.session.user.profileWall.filter(
        (el) => el._id.toString() !== req.params.postId
    );
    Promise.all([
        req.session.user.save(),
        Post.findByIdAndRemove(req.params.postId),
    ])
        .then((results) => {
            res.json({success: true});
        })
        .catch((e) => {
            res.json({success: false});
        });
}
