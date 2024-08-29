
const JWT= require('jsonwebtoken');
const secret = "Itsasecretkey"; 

function createTokenForUser(user){

    const payload={
        _id : user._id,
        email :user.email,
        fullname: user.fullname,
        profileImageURL : user.profileImageURL,
        role :user.role,
    }; 
    console.log("load",payload);
    const token= JWT.sign(payload,secret);
    console.log("hi");
    return token;
}

function validateToken(token){
    const payload= JWT.verify(token, secret);
    console.log("payload",payload);
    return payload;
}

module.exports={
    createTokenForUser,
    validateToken,
};