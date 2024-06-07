const express=require('express')
const Product=require('../Modals/Schema')
const Createproducet=require('./Function');
const Category = require('../Modals/category');
const multer=require("multer")
const router=express.Router();

const File_Type={
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'

}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const isvalid=File_Type[file.mimetype]
      let error=new Error('Invalid image type')
      if(isvalid) error=null
      cb(error, 'public/upload')
    },
    filename: function (req, file, cb) {
      const extension=File_Type[file.mimetype]
      const filename=file.originalname.split(' ').join('-')
      cb(null, `${filename}-${Date.now()}.${extension}`)
    }
  })
  
  const upload = multer({ storage: storage })


router.post(`/`,upload.single('Image'),async (req,res)=>{
try{
    const category=await Category.findById(req.body.category)
    const file=req.file 
if(!file) throw new Error
}catch(err){
    return res.status(400).json({message:"Invalid category"})
}
    const filename=req.file.filename
    const basepath=`${req.protocol}://${req.get('host')}/public/upload`
    const product=await Product.create({
        
        name:req.body.name,
           description:req.body.description,
           richDescription:req.body.richDescription,
           Image:`${basepath}/${filename}`,
           Images:req.body.Images,
           brand:req.body.brand,
           price:req.body.price,
           category:req.body.category,
           countinstock:req.body.countinstock,    
           rating:req.body.rating,   
           numReviews:req.body.numReviews,
           isFeatured:req.body.isFeatured,
           dateCreated:req.body.dateCreated
    })

   if(!product) res.status(500).json("Unable to create the product")
    res.status(200).json({
            data:{product}

            })

})

router.get('/',async(req,res)=>{

   const alldata= await Product.find()

   res.status(200).json({
    data:alldata
   })

})

router.get('/:id',async(req,res)=>{
try{
    const singldata=await Product.findById(req.params.id).populate('category')
    if(!singldata) throw new Error
    res.status(200).json({data:singldata})

}catch(err){
    res.status(400).json({message:"Unable to find the data"})

}

})

router.put('/:id',upload.single('Image'),async(req,res)=>{
try{
    const category=await Category.findById(req.body.category)
} catch(err){
  return   res.status(400).json({
        message:"Invalid category"
    })
}
const product=await Product.findById(req.params.id)
let updatedimage

if(!req.file){
    updatedimage=product.Image
}

if(req.file){
const fileName=req.file.filename
const baseurl=`${req.protocol}://${req.get('host')}/public/upload`
updatedimage=`${baseurl}/${fileName}` 
}


    const updateddata=await Product.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        Image:updatedimage,
        Images:req.body.Images,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countinstock:req.body.countinstock,    
        rating:req.body.rating,   
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured,
        dateCreated:req.body.dateCreated
    },{new:true})

   return  res.status(200).json({
    data:updateddata
   })


})

router.delete('/:id',async(req,res)=>{
    try{
        const deleteddata=await Product.findByIdAndDelete(req.params.id)
       return res.status(200).send('Deleted successfully')
    }catch(err){
       return  res.status(404).json({
            message:"Unable to delete the product"
        })
    }
})

router.get('/get/count',async(req,res)=>{
    try{
        const datacount= await Product.find().countDocuments()
       return        res.status(200).json({
                     count:datacount
                     })
    }catch(err){
       return  res.status(400).json({
            message:"Unable to count the document"
        })
    }


})

router.get('/featured/:count',async(req,res)=>{
   const count= req.params.count ? req.params.count :0
    try{
    const featureddata=await Product.find({isFeatured:true}).limit(+count)
    return res.status(200).json({
        isFeatured:featureddata
    })
    }catch(err){
        res.status(400).json({
            message:"Unable to find is featured document"
        })
    }

})

router.get('/get',async(req,res)=>{
let categories

if(req.query.category){
categories={category:req.query.category.split(',')}
}
    
try{
        const datacategories=await Product.find(categories).populate('category')
        return res.status(200).json({
            data:datacategories
        })
        }catch(err){
            res.status(400).json({
                message:"Unable to find is datacategories document"
            })
        }

})
router.delete('/',async(req,res)=>{
    await Product.deleteMany()

    res.status(200).send('deleted')
})

router.put('/gallary/:productid', upload.array('Images',10) ,async(req,res)=>{

    try{
        const  findingdata=await Product.findById(req.params.productid)
    }catch(err){
        res.send("Invalid product id")
    }
    let imagess=[]
    console.log(req.files)

    if(req.files){
        req.files.map((el)=>{
            let basepath=`${req.protocol}://${req.get('host')}/public/upload`
            let fileName=`${basepath}/${el.filename}`
            imagess.push(fileName)
        })
    }

    const updatingtheimages=await Product.findByIdAndUpdate(req.params.productid,{Images:imagess},{new:true})

    res.status(200).json({data:updatingtheimages})


})


module.exports=router;