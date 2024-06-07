const mongoose=require('mongoose')

const Userschema=new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
passwordHash:{
    type:String,
    required:true
},
phone:{
    type:String,
    required:true
},
appartment:{
    type:String,
    default:""
},
zip:{
    type:String,
    default:""
},
city:{
    type:String,
    default:""
},
country:{
    type:String,
    default:""
},
isAdmin:{
    type:Boolean,
    default:""
},
street:{
    type:String,
    default:""

}

},{toJSON:{virtuals:true},toObject:{virtuals:true}})

Userschema.virtual('id').get(function(){
    return this._id
})


const User=mongoose.model('User',Userschema)

module.exports=User