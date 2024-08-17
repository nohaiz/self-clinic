function isAdmin(req, res, next) {
    if (!req.user.type[2000]) {
        return res.status(401).json({
            message: "Invalid User"
        })
    } else {
        next()
    }
}
module.exports=isAdmin;