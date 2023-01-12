

const mongoose=require('mongoose')
const fileSchema = mongoose.Schema
({

    name:{
        type:String,
       
    },
    docFile:{
        type:String,
        required:true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }

},
{ timestamps: true },

)

module.exports = mongoose.model('file',fileSchema)