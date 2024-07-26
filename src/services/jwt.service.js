
const jwt = require('jsonwebtoken');

const generalAccessToken = (payload) => {
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '365d' });
    return token;
};

const generalRefreshToken = (payload) => {
    const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: '365d' });
    return refresh_token;
};

const refreshToken = async (token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN, function (err, user) {
                if (err) {
                    return resolve({
                        message: 'The authentication',
                        status: 'ERROR',
                    })
                }

                const access_token = generalAccessToken({
                    id: user?.id,
                    roleId: user?.roleId,
                })

                return resolve(
                    {
                        status: 'OK',
                        message: 'SUCCESS',
                        access_token,
                    }
                );

            });
        } catch (error) {
            return reject(error);
        }
    })
}

module.exports = {
    generalAccessToken,
    generalRefreshToken,
    refreshToken,
};