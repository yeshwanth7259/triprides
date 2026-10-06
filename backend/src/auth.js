const jwt=require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET||'dev-tripride-secret';
function sign(user){return jwt.sign({id:user.id,name:user.name,email:user.email,role:user.role},JWT_SECRET,{expiresIn:'7d'});}
function auth(req,res,next){
 const token=(req.headers.authorization||'').replace('Bearer ','');
 if(!token)return res.status(401).json({message:'Authentication required'});
 try{req.user=jwt.verify(token,JWT_SECRET);next();}catch(e){return res.status(401).json({message:'Invalid or expired token'});}
}
function allow(...roles){return (req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({message:'Forbidden'});}
module.exports={sign,auth,allow};
