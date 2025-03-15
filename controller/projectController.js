import catchAsyncErrors from "../middleware/catchAsynchError.js"
import ErrorHandler from "../middleware/error.js"
import { Project } from "../models/projectSchema.js"
import {v2 as cloudinary} from "cloudinary"

export const addNewProject = catchAsyncErrors(async(req,res, next) =>{
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Project Banner Image Required"))

    }

    const {projectBanner} = req.files
    const{
        title,
        description,
        gitRepoLink,
        projectLink,
        technologies,
        stack,
        deployed}= req.body


        if(!title ||
            !description ||
            !gitRepoLink ||
            !projectLink ||
            !technologies ||
            !stack ||
            !deployed ){
                return next(new ErrorHandler("Please Provide All Detailes", 400))

            }
            const  cloudinaryResponce = await cloudinary.uploader.upload(projectBanner.tempFilePath,
                {folder: "Project Image"}
            )
            if(!cloudinaryResponce || cloudinaryResponce.error){
                console.log("Cloudinary Error", cloudinaryResponce.error || "Unknow cloudinary Error")
                return next(new ErrorHandler("Failed to upload ProjectBanner o cloudinary", 500))
            }

            

            const project = await Project.create({
                title,
        description,
        gitRepoLink,
        projectLink,
        technologies,
        stack,
        deployed,
        projectBanner:{
            
                public_id: cloudinaryResponce.public_id,
                url:cloudinaryResponce.secure_url
}
        })
        res.status(200).json({
            success: true,
            message: "new Project created!",
            project
        })



})

export const deleteProject= catchAsyncErrors(async(req,res, next) =>{

    const {id} = req.params
    const project = await Project.findById(id);
    if(!project){
        return next (new ErrorHandler("Project not found!", 400))
    }
    await project.deleteOne();
    res.status(200).json({
        success: true,
        message: "Project Deleted",

    })


    
})

export const updateProject = catchAsyncErrors(async(req,res, next) =>{

    const newProjectData={
        title:req.body.title,
        description:req.body.description,
        gitRepoLink:req.body.gitRepoLink,
        projectLink:req.body.projectLink,
        technologies:req.body.technologies,
        stack:req.body.stack,
        deployed:req.body.deployed  
      };
      //console.log("NewProject Data",newProjectData)

        if(req.files && req.files.projectBanner){
                const projectBanner = req.files.projectBanner;
                const project = await Project.findById(req.params.id)
                console.log("Project id", project)
                const ProjectImageId = project.projectBanner.public_id;
                await cloudinary.uploader.destroy(ProjectImageId)
                const cloudinaryResponce = await cloudinary.uploader.upload(projectBanner.tempFilePath, {folder:"Project Image"});
             
                newProjectData.projectBanner = {
                    public_id:cloudinaryResponce.public_id,
                    url: cloudinaryResponce.secure_url
                }
            }
        
    
        

            const project = await Project.findByIdAndUpdate(req.params.id, newProjectData,{
                new: true,
                runValidators: true,
                useFindAndModify:false
            });
            console.log("Project:",project)

            res.status(200).json({
                success:true,
                message: "Project Updated",
                project
            })




    
})

export const getAllProject = catchAsyncErrors(async(req,res, next) =>{
    const project = await  Project.find()
    res.status(200).json({
        success:true,
        project
    })

    
})
export const getsingleProject = catchAsyncErrors(async(req,res, next) =>{
    const {id} = req.params
    const project = await Project.findById(id);
    if(!project){
        return next (new ErrorHandler("Project not found!", 400))
    }
    res.status(200).json({
        success: true,
        project
    })





    
})