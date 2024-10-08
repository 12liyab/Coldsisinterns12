const JWT =  require('jsonwebtoken')
const createError =  require('http-errors')

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {} 
            const secret = process.env.JWT_SECRET
            const options = {
            expiresIn: "30s", //AcessToken  expires in 30 seconds
            issuer: "liyabpage.com",
            audience: userId
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    // reject(err)
                    reject(createError.InternalServerError())
                }
                    
                resolve(token)
            })
        })
    },
    verifyAccessToken: (req,  res, next) => {
        if (!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken =  authHeader.split(' ')
        const token  = bearerToken[1]
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,  payload) => {
            if (err) {
            const message = 
            err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
            return next(createError.Unauthorized(message))
            }
            req.payload = payload
            next()
        })
    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {} 
            const secret = process.env.REFRESH_TOKEN_SECRET
            const options = {
            expiresIn: "1y", //Refresh  token expires in 1 year
            issuer: "liyabpage.com",
            audience: userId
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    // reject(err)
                    reject(createError.InternalServerError())
                } 
                resolve(token)
            })
        })
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(
                refreshToken, 
                process.env.REFRESH_TOKEN_SECRET, 
                (err, payload) => {
                if (err) return reject(createError.Unauthorized())
                    const userId = payload.aud

                resolve(userId) //Verifying refreshTokens and Blacklisting
            }
        )
        })
    },
    }