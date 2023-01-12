

const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const dotenv =require( 'dotenv');
dotenv.config()

const userSchema = mongoose.Schema
({
    name:{
        type:String,
        required:true,
    },

    password:{
        type:String,
        require:true,
    },

},
{ timestamps: true },

)

userSchema.methods.generateAccessToken = async function () {
    const user = this
    const access_token = jwt.sign({ _id: user._id.toString() }, process.env.ACCESS_TOKEN_SECRET , {expiresIn : '30 m'})
  
 
    return access_token
}


userSchema.methods.generateRefreshToken = async function () {
    const user = this
    const refresh_token = jwt.sign({ _id: user._id.toString() }, process.env.REFRESH_TOKEN_SECRET ,{expiresIn : '2 days'})
  
    return refresh_token
}

module.exports = mongoose.model('user',userSchema)