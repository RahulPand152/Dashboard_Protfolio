class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    try {
        err.message = err.message || "Internal Server Error";
        err.statusCode = err.statusCode || 500;
    

        if (err.code === 11000) {
            const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
            err = new ErrorHandler(message, 400);
        }

        if (err.name === "JsonWebTokenError") {
            err = new ErrorHandler("Json web token is invalid, Try Again", 400);
        }

        if (err.name === "TokenExpiredError") {
            err = new ErrorHandler("Json web token has expired, Try to Login", 400);
        }

        if (err.name === "CastError") {
            err = new ErrorHandler(`Invalid ${err.path}`, 400);
        }

        const errorMessage = err.errors ? Object.values(err.errors).map(error => error.message).join(" ") : err.message;
        console.log(errorMessage)
        return res.status(err.statusCode).json({
            success: false,
            message: errorMessage,
        });
        
    } catch (error) {
        console.error("Unexpected error in errorMiddleware:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
};    

export default ErrorHandler;