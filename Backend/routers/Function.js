const Product=require('../Modals/Schema') 



exports.Createproducet= async function (req,res,next){
    try{
      const completedata=await Product.create(req.body)
    
      res.status(200).json({
          data:completedata,
          message:'data uploaded successfully'
      })
    }catch(err){
        res.status(400).json({
          data:"The error occured cheack your data "
        })
      }
      }

      exports.Gettingalldata=async (req,res,next)=>{
     try{
        const data=await Product.find()
        
        res.status(200).json({
            data
        })
    }catch(err){
        res.status(400).json({
            message:"The unable to featch the data"
        })
    }
      }