import catchAsyncErrors from "../middleware/catchAsynchError.js";
import ErrorHandler from "../middleware/error.js";
import {SoftwareApplication }from "../models/softwareApplicationSchema.js"
import {v2 as cloudinary} from "cloudinary"

export const addNewApplication = catchAsyncErrors(async(req,res, next) =>{
    if(!req.files || Object.keys(req.files).length ===0){
        return next(new ErrorHandler("Software application icon/svg required"))
    }
    const {svg}= req.files;
        const{name} = req.body
        if(!name){
            return next (new ErrorHandler("Software's Name is required", 400))
        }
        const cloudinaryResponce = await cloudinary.uploader.upload(svg.tempFilePath, {folder: "Portfolioi Software application"})
         if(!cloudinaryResponce || cloudinaryResponce.error){
            console.log("Cloudinary Error", cloudinaryResponce.error || "Unknow cloudinary Error")
        }
        const softwareApplication= await SoftwareApplication.create({
            name,
            svg:{
                public_id: cloudinaryResponce.public_id,
                url:cloudinaryResponce.secure_url

            }
        })
        res.status(200).json({
            success: true,
            message: "New Software application!",
            softwareApplication
        })
    
       
})

export const deleteApplication = catchAsyncErrors(async(req,res, next) =>{
    const {id} = req.params;
    const softwareApplication = await SoftwareApplication.findById(id)
    if(!softwareApplication){
        return next(new ErrorHandler("Software Application not founded!", 404));
    }
    const softwareApplicationsvgId = softwareApplication.svg.public_id;
    await cloudinary.uploader.destroy(softwareApplicationsvgId)
    await softwareApplication.deleteOne();
    res.status(200).json({
        success:true,
        message:"Message Application Deleted!"
    })
    
})

export const getApplication = catchAsyncErrors(async(req,res, next) =>{

    const softwareApplications = await SoftwareApplication.find();
        res.status(200).json({
            success: true,
            softwareApplications,
        })
    
})