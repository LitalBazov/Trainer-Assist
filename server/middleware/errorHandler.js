const errorHandler = (error, req,res,next) => {
    return res.status(error.statusCode || 500).json({error: error.message || 'Internal server error'});
};

module.exports = { errorHandler };