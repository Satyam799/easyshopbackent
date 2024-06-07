const mongoose=require("mongoose")

const orderitems=new mongoose.Schema({

    quantity:{
        type:Number,
        required:true,
        
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }
})

const OrderItem=mongoose.model('OrderItem',orderitems)

module.exports=OrderItem