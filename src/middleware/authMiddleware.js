
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
    // console.log('token', req.headers.token);
    const token = req.headers.token.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR',
            })
        }
        console.log(user);
        const { roleId } = user;

        if (roleId == 1) {
            next();
        }
        else {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR',
            })
        }
    });
}

// const authGetDetailsMiddleware = (req, res, next) => {
//     // console.log('token', req.headers.token);
//     const token = req.headers.token.split(' ')[1];
//     const userId = req.params.id;
//     jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
//         if (err) {
//             return res.status(404).json({
//                 message: 'The authemtication',
//                 status: 'ERROR',
//             })
//         }

//         const { isAdmin, id } = user;

//         console.log(user);

//         if (isAdmin || id === userId) {
//             next();
//         }
//         else {
//             return res.status(404).json({
//                 message: 'The authemtication',
//                 status: 'ERROR',
//             })
//         }
//     });
// }

module.exports = {
    authMiddleware,
    // authGetDetailsMiddleware,

}