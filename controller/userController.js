import catchAsyncErrors from "../middleware/catchAsynchError.js"
import ErrorHandler from "../middleware/error.js"
import { User } from "../models/userSchema.js"
import{v2 as cloudinary} from "cloudinary"
import { generateToken } from "../utils/jwtToken.js"
import {sendEmail} from "../utils/sendEmail.js"
import crypto from "crypto"

export const register = catchAsyncErrors(async (req, res, next) =>{
    if(!req.files || Object.keys(req.files).length ===0){
        return next(new ErrorHandler("Avatar and Resume are required"))
    }

    const {avatar, resume}= req.files;
    //console.log(avatar, resume)
    const cloudinaryResponceForAvatar = await cloudinary.uploader.upload(avatar.tempFilePath, {folder: "AVATARS"})
     if(!cloudinaryResponceForAvatar || cloudinaryResponceForAvatar.error){
        console.log("Cloudinary Error", cloudinaryResponceForAvatar.error || "Unknow cloudinary Error")
    }

    const cloudinaryResponceForResume = await cloudinary.uploader.upload(resume.tempFilePath, {folder: "RESUME"})
     if(!cloudinaryResponceForResume || cloudinaryResponceForResume.error){
        console.log("Cloudinary Error", cloudinaryResponceForResume.error || "Unknow cloudinary Error")
    }


    const {fullName, email,phone,
        aboutme, password, portfolioURL,
        githubURL,instagramURL,  facebookURL,
        twitterURL,linkedInURL
        
    } = req.body;

    const user = await User.create({
        fullName,
         email,
         phone,
        aboutme,
         password,
          portfolioURL,
        githubURL,
        instagramURL,
          facebookURL,
        twitterURL,
        linkedInURL,
        avatar:{
            public_id: cloudinaryResponceForAvatar.public_id,
            url: cloudinaryResponceForAvatar.secure_url,

        },
        resume:{
            public_id: cloudinaryResponceForResume.public_id,
            url: cloudinaryResponceForResume.secure_url,

        },
    })
    generateToken(user,"User Registered!", 200, res)

})

export const login = catchAsyncErrors(async(req, res, next) =>{
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("Email and Password are required"))}
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return next(new ErrorHandler("invalid Email or Password"))
        }
        const isPasswordMatch = await user.comparePassword(password);
        if(!isPasswordMatch){
            return next(new ErrorHandler("invalid Email or Password"))
        }

    generateToken(user, "Logged In", 200, res);
})

export const logout = catchAsyncErrors(async(req, res,next) =>{
    res.status(200).cookie("token", "",{
        expires: new Date(Date.now()),
        httpOnly: true
    
    }).json({
        success: true,
        message: "Logged out"
    })
})

export const getUser = catchAsyncErrors(async (req,res,next) =>{
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user
    })
})

export const updateProfile = catchAsyncErrors(async(req,res,next) =>{
    const newUserdata ={
        fullName:req.body.fullName,
        email:req.body.email,
        phone:req.body.phone,
       aboutme:req.body.aboutme,
        portfolioURL:req.body.portfolioURL,
       githubURL:req.body.githubURL,
       instagramURL:req.body.githubURL,
         facebookURL:req.body.facebookURL,
       twitterURL:req.body.twitterURL,
       linkedInURL:req.body.linkedInURL,

    }
    if(req.files && req.files.avatar){
        const avatar = req.files.avatar;
        const user = await User.findById(req.user.id)
        const protfileImageId = user.avatar.public_id;
        await cloudinary.uploader.destroy(protfileImageId)
        const cloudinaryResponce = await cloudinary.uploader.upload(avatar.tempFilePath, {folder: "AVATARS"})
     
        newUserdata.avatar = {
            public_id:cloudinaryResponce.public_id,
            url: cloudinaryResponce.secure_url
        }
    }

    if(req.files && req.files.resume){
        const resume = req.files.resume;
        const user = await User.findById(req.user.id)
        const resumeId = user.avatar.public_id;
        await cloudinary.uploader.destroy(resumeId)
        const cloudinaryResponce = await cloudinary.uploader.upload(resume.tempFilePath, {folder: "RESUME"})
     
        newUserdata.resume = {
            public_id:cloudinaryResponce.public_id,
            url: cloudinaryResponce.secure_url
        }
    }


    const user = await User.findByIdAndUpdate(req.user.id,newUserdata, {
        new:true,
        runValidators: true,
        useFindAndModify:true
    })

    res.status(200).json({
        success:true,
        message: "Portfolio updated!",
        user
    })
})

export const updatePassword = catchAsyncErrors(async(req, res, next) =>{
    const{currentPassword, newPassword, confirmNewPassword} = req.body;
    if(!currentPassword || !newPassword  || !confirmNewPassword)
    {
        return next (new ErrorHandler("Please Fill All Field", 400))
    }
    const user = await User.findById(req.user.id).select("+password")
    const isPasswordMatch = await user.comparePassword(currentPassword);

    if(!isPasswordMatch )
        {
            return next (new ErrorHandler("Inccorrect current Password", 400))
        }
        if(newPassword !== confirmNewPassword){
            return next (new ErrorHandler("new Password and confirm New Password Do  not match", 400))

        }
        user.password = newPassword
        await user.save();
        res.status(200).json({
            success:true,
            message: "Password Updated"
        })

})
export const getUserPortfolio = catchAsyncErrors(async(req,res,next) =>{
    const id="67d252baaeee209c186c9030";
    const user = await User.findById(id);
    res.status(200).json({
        success: true,
        user
    })
})

export const forgotPassword = catchAsyncErrors(async(req,res,next) =>{
    const user = await User.findOne({email: req.body.email})
    console.log("User Email", user)
    if (!user) {
        return next(new ErrorHandler("user not found", 404))
    }
    const resetToken = user.getResetPasswordToken();
    //console.log("ResetToken", resetToken)
    await user.save({validateBeforesave: false})
    const resetPasswordUrl= `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`
    const message = `Your Reset Password is : \n\n ${resetPasswordUrl} \n\n If you're not request for this please ignore it.`;
   // console.log("Message", message)

    try {
        await sendEmail({
            email: user.email,
            subject: "Personal Portfolio Dashboard Recovery Password",
            message,
        })
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })
    } catch (error) {
      user.resetPasswordExpired = undefined;
      user.getResetPasswordToken= undefined;
      await user.save();
      return next(new ErrorHandler(error.message, 500))
    }
})

export const resetPassword = catchAsyncErrors(async (req,res,next) =>{
    const {token} =req.params;
    //console.log("token", token)
    const resetPasswordToken = crypto.createHash('shake256').update(token).digest('hex')
    //console.log("RsetPassword", resetPasswordToken)
    const user= await User.findOne({
        resetPasswordToken,
        resetPasswordExpired:{$gt: Date.now()}
    });
   // console.log("User User is", user)

    if(!user){
        return next(
            new ErrorHandler(
                "Reset password token is invalid or has been expired",400
            )
        )
    }
    if(req.body.password != req.body.confirmPassword){
        return next (new ErrorHandler("Password & Confirm Do Not Match."))
    }
    user.password= req.body.password;
    user.resetPasswordExpired= undefined;
    user.resetPasswordToke=undefined
    await user.save();
    generateToken(user, "Reset Password Successfuly", 200, res);

})