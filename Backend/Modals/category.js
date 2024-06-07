const mongoose=require('mongoose')


const Categoryschema= new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    icon:{
        type:String,

    },
    color:{
        type:String,

    }
})

const Category=mongoose.model('Category',Categoryschema)

module.exports=Category