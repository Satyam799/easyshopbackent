
const express=require('express')
const router=express.Router()
const bcrypt=require("bcryptjs")
const JWT =require("jsonwebtoken")
const User = require('../Modals/user')

router.post('/',async(req,res)=>{
try{
const updatedata=await User.create({
    name:req.body.name,
    email:req.body.email,
    passwordHash:bcrypt.hashSync(req.body.password,10),
    phone:req.body.phone,
    appartment:req.body.appartment,
    zip:req.body.zip,
    city:req.body.city,
    country:req.body.country,
    isAdmin:req.body.isAdmin,
    street:req.body.street
})
return res.status(200).json({
    data:updatedata
})

}catch(err){
   return  res.status(404).json({
        message:err.message
    })
}
})
router.get('/',async(req,res)=>{

    const alldata= await User.find().select('-passwordHash')
 
    res.status(200).json({
     data:alldata
    })
 
 })
 
 router.get('/:id',async(req,res)=>{
 try{
     const singldata=await User.findById(req.params.id).select("-passwordHash")
     if(!singldata) throw new Error
     res.status(200).json({data:singldata})
 
 }catch(err){
     res.status(400).json({message:"Unable to find the data"})
 
 }
 
 })



 router.post('/login',async(req,res)=>{
    const user=await User.findOne({email:req.body.id})
   if(!user) return res.status(404).send("No user found with this email address")

if(user && bcrypt.compareSync(req.body.password,user.passwordHash)){

const secrate=process.env.secerate
   


const token=JWT.sign({
        userid:user.id,
        isAdmin:user.isAdmin
    },
    secrate,
    {expiresIn:"1d"}
)

    res.status(200).json({
        user:user.email,
        token:token
    })
}else{
    res.status(404).send("No user found with this password address")
}

 })

router.get('/get/usercount',async(req,res)=>{

try{
    const datacount=await User.find().countDocuments()
    res.status(200).json({
        usercount:datacount
    })
}catch(err){
    res.status(200).json({
       message:"some error occured on counting up the documents"
    }) 
}
    
})
router.delete('/:id',async(req,res)=>{
    try{
        const singldata=await User.findByIdAndDelete(req.params.id)
        if(!singldata) throw new Error
        res.status(200).json({data:singldata})
    
    }catch(err){
        res.status(400).json({message:"Unable to find the data"})
    
    }
    
    })

module.exports=router
/*{
    "name":"Satyam Tripathi",
    "email":"J@gmail.com",
    "password":"123456789",
    "phone":418196,
    "appartment":"hnudsncusonusciot",
    "zip":"iosdiomds",
    "city":"hncosncosd",
    "country":"Delhi",
    "isAdmin":"true",
    "street":"jiodsmiosdc"
}*/ 