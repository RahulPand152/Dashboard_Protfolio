import catchAsyncErrors from "../middleware/catchAsynchError.js"
import ErrorHandler from "../middleware/error.js"
import { Message } from "../models/messageSchema.js"

export const sendMessage = catchAsyncErrors(async(req,res,next) =>{
    const {senderName, subject, message} = req.body;
    //console.log("Request Body", req.body)
    
    if (!senderName || !subject || !message) {
        return  next(new ErrorHandler("please Fill full form", 400));
    }
    

    //try
     //{
        const data = await Message.create({ senderName, subject, message });
        // console.log("Database Save Success:", data); // Debugging

        res.status(200).json({
            success: true,
            message: "Message sent",
            data,
        });
    })

export const getAllMessage = catchAsyncErrors(async (req,res,next) =>{
    const message = await Message.find();

    res.status(200).json({
        success:true,
        message,
    })
})

export const deleteMessage = catchAsyncErrors(async (req,res,next) =>{

    const {id} = req.params;
    const message = await Message.findById(id)
    if(!message){
        return next( new ErrorHandler("Message Already delete!", 400))
    }
    await message.deleteOne();
    res.status(200).json({
        success: true,
        message: "Message Deleted"
    })
})



    // } catch (error) {
    //     console.error("Database Error:", error); // Debugging
    //     return next(new ErrorHandler("Database error, could not save message", 500));
    // }

            
   
