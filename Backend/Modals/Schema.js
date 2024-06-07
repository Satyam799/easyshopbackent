const mongoose=require('mongoose')


const Eshopschema= new mongoose.Schema({

    name:{
     type:String,
     required:true
    },
    description:{
      type:String,
      required:true  
    },
    richDescription:{
        type:String,
        default:''
    },
    Image:{
        type:String,
        default:''
    },
    Images:[{
        type:String
    }],
    brand:{
        type:String,
        default:''
    },
    price:{
        type:String,
        default:0
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    countinstock:{
        type:Number,
        required:true,
        min:0,
        max:255
    },    
    rating:{
        type:Number,
        default:0
    },   
     numReviews:{
        type:Number,
        default:0
       
    },
    isFeatured:{
        type:Boolean,
        default:false
    },
    dateCreated:{
        type:Date,
        default:Date.now
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

Eshopschema.virtual("id").get(function(){
    return this._id
})

const Product=mongoose.model('Product',Eshopschema) 

module.exports=Product