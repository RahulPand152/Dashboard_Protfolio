import catchAsyncErrors from "../middleware/catchAsynchError.js";
import { Skill } from "../models/skillSchema.js";
import {v2 as cloudinary} from "cloudinary"
import ErrorHandler from "../middleware/error.js";


export const addNewSkill = catchAsyncErrors(async (req,res,next) =>{
    if(!req.files || Object.keys(req.files).length ===0){
        return next(new ErrorHandler("Skill svg  required"))
    }
    const {svg}= req.files;
        const{title, proficiency} = req.body
        if(!title || !proficiency){
            return next (new ErrorHandler("please fill full form!", 400))
        }
        const cloudinaryResponce = await cloudinary.uploader.upload(svg.tempFilePath, {folder: "skil portfolio skill"})
         if(!cloudinaryResponce || cloudinaryResponce.error){
            console.log("Cloudinary Error", cloudinaryResponce.error || "Unknow cloudinary Error")
        }

        const skill = await Skill.create({title, proficiency,
            svg:{
                public_id: cloudinaryResponce.public_id,
                url:cloudinaryResponce.secure_url

            }
        })
        res.status(200).json({
            success:true,
            message: "New skill Added",
            skill
        })

})

export const deleteSkill = catchAsyncErrors(async (req,res,next) =>{
    const {id} = req.params;
    const skill = await Skill.findById(id)
    if(!skill){
        return next(new ErrorHandler("skill not founded!", 404));
    }
    const skillSvgId = skill.svg.public_id;
    await cloudinary.uploader.destroy(skillSvgId)
    await skill.deleteOne();
    res.status(200).json({
        success:true,
        message:"skill Deleted!"
    })
    
})

export const updateSkill = catchAsyncErrors(async (req,res,next) =>{
    const {id} = req.params;
    let skill = await Skill.findById(id)
    if(!skill){
        return next(new ErrorHandler("skill not founded!", 404));
    }

    const { proficiency} = req.body
    skill= await Skill.findByIdAndUpdate(id,{proficiency},{
        new: true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success: true,
        message: "Skill Updated",
        skill,
    })
    
})

export const getAllSkill= catchAsyncErrors(async (req,res,next) =>{

    const skill = await Skill.find();
        res.status(200).json({
            success: true,
            skill,
        })
    
})