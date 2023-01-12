

const jwt = require('jsonwebtoken')
const user = require('../models/user')
const dotenv =require( 'dotenv');
dotenv.config()
 
const userAuth = async (req, res, next) => {
    try {
       
       const token = req.cookies.access_token
      // console.log("token is" , token)
       if(!token)
        return res.status(401).send({ error: 'Please Login' })
 
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user1 = await user.findOne({ _id: decoded._id })

        if (!user1) {
           return res.status(403).send("unauthorized")
        }
    
        req.user = user1      
        next()
    } catch (e) {
        console.log(e)
       
      res.status(401).send({ error: 'Please Login to access .' })
    }
}

module.exports = userAuth