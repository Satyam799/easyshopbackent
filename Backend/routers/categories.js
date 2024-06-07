const express=require('express')
const Category = require('../Modals/category')
const router=express.Router()

router.post('/',async(req,res)=>{
try{
    const category= await Category.create({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
    })
res.status(200).json({
    status:'success',
    data:{
        category
    }
})
}catch(err){
res.status(400).json({
    message:'Unable to create category'
})  

}
})

router.delete('/:id',async (req,res)=>{
try{    
    const deleted=await Category.findByIdAndDelete(req.params.id)
    console.log(deleted)
    if(!deleted) throw new Error("No category found with this id")

    res.status(200).json({
        message:'Deleted successfully '
    })

}catch(err){
res.status(400).json({
    message:"Unable to delete the data"
})

}
})

router.get('/',async (req,res)=>{
   try{
    const list = await Category.find()
res.status(200).json({
    status:'success',
    data:{
        list
    }
})   
}catch(err){
res.status(400).json({
    status:"failure",
    message:'Unable to fetch the data'
})
}

})
router.get('/:id',async(req,res)=>{

    try{
        const list = await Category.findById(req.params.id)
    res.status(200).json({
        status:'success',
        data:{
            list
        }
    })   
    }catch(err){
    res.status(400).json({
        status:"failure",
        message:'Unable to fetch the data'
    })
    }

    
})

router.put('/:id',async(req,res)=>{
  try{
    const newdata=await Category.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        icon:req.body.icon,        
        color:req.body.color

    },{new:true}) 
res.status(200).json({
    status:"success",
    data:{
        newdata
    }
})
}catch(err){
    res.status(400).json({
        status:'failure',
        message:"Data is not uploaded successfully"
    })
}

})





module.exports=router