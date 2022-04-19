exports.isLoggendIn = (req, res, next) => {
    if (req.isAuthenticated()){
        next()
    }else {
        res.status(401).send('you are not login')
    }
}

exports.isNotLoggendIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        next()
    }else {
        res.status(401).send('you are login')
    }
}
