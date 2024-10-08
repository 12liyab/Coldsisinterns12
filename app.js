const express = require('express')
const morgan = require('morgan')
const createError =  require('http-errors')
require('dotenv').config()
require('./helpers/init_mongodb')
const { verifyAccessToken} = require('./helpers/jwt_helper')

const AuthRoute = require('./Routes/Auth.route')

const app = express()
app.use(morgan('dev'))  // middleware for logging
app.use(express.json())
app.use(express.urlencoded({ extended:  true }))  // middleware for parsing json data not gonna use for API

app.get('/', verifyAccessToken, async (req, res, next) => {
    res.send("Hello from express.")
})

app.use('/auth',  AuthRoute)


app.use(async  (req, res, next) => {
    next(createError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status  || 500)
    res.send({
        error: {
            status: err.status ||  500,
            message: err.message,
        },
    })
})

const PORT = process.env.PORT  || 3055

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})