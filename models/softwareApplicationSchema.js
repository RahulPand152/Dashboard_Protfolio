import mongoose from "mongoose";

const softwareApplicationSchemaa = new mongoose.Schema({

    name:String,
        svg:{
            public_id:{
                type:String,
                required: true
            },
            url:{
                type:String,
                required:true
            }
        }
    
})

export const SoftwareApplication = mongoose.model ("SoftwareApplication", softwareApplicationSchemaa)