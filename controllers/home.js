exports.getIndex = (req, res, next) => {
    res.render('home/index')
}

exports.postUserData = (req, res, next) => {
    console.log(req.body);
}
