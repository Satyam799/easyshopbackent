const  {expressjwt} = require("express-jwt");


function Auth(){
const secerate=process.env.secerate
return expressjwt({secret:secerate,algorithms:["HS256"],isRevoked:Revokedfunction}).unless({
    path:[
        '/api/v1/user/login',
        '/api/v1/users/register',
        {url:/\/api\/v1\/upload(.*)/,methods:['GET','OPTIONS']},
        {url:/\/api\/v1\/product(.*)/,methods:['GET','OPTIONS']},
        {url:/\/api\/v1\/category(.*)/,methods:['GET','OPTIONS']}

    ]
})

}

async function Revokedfunction(req,payload,done){

    if(!payload.payload.isAdmin){
       return true
    }
    done()

}


module.exports=Auth