

function errorhandler(){
    return (err,req,res,next)=>{
        if(err.name==="UnauthorizedError"){
        return res.status(400).json({message:"The user is not authorozed please check the user again"})
        }
        next()

      }
}
module.exports=errorhandler