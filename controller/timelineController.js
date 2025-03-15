import catchAsyncErrors from "../middleware/catchAsynchError.js";
import ErrorHandler from "../middleware/error.js";
import { Timeline } from "../models/timelineSchema.js";
export const postTimeline = catchAsyncErrors(async(req,res,next) =>{

    const {title, description, from, to}= req.body;
    const newtimeline = await Timeline.create({title, description, timeline:{from,to

    }
})
res.status(200).json({
    success:true,
    message: "Timeline Added",
    newtimeline
})

})

export const deleteTime = catchAsyncErrors(async(req,res,next) =>{
    const {id} = req.params;
    const timeline = await Timeline.findById(id);
    if(!timeline){
        return next(new ErrorHandler("Time not found",404))
    }
    await timeline.deleteOne();
    res.status(200).json({
        success: true,
        message:"Timeline deleted"
    })
    
})

export const getAllTimelines= catchAsyncErrors(async(req,res,next) =>{

    const timeline = await Timeline.find();
    res.status(200).json({
        success: true,
        timeline,
    })
    
})