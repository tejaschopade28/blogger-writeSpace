
const {validateToken}= require("../service/service")
function checkForAuthenticationCookies(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];  // Corrected variable name
        
        // If no token cookie is found, proceed to the next middleware or route
        if (!tokenCookieValue) {
            return next();
        }

        try {
            // Validate the token and attach the user payload to req.user
            const userPayload = validateToken(tokenCookieValue);
            console.log(userPayload);  // Use the correct variable name here
            req.user = userPayload;
            res.locals.user=req.user;
            console.log(res.locals.user);
            return next(); // Proceed to the next middleware or route
        } catch (error) {
            console.error("Token validation failed:", error); // Log the error for debugging
            // Optionally, you could handle the error by redirecting to a login page or sending an error response
            return res.status(401).send("Invalid or expired token.");
        }
    };
}

module.exports = {
    checkForAuthenticationCookies,
};
