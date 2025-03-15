import nodemailer from "nodemailer"

export const sendEmail= async(Options) =>{
 try{
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD,
        }
    })
// console.log("SMTP Mail",process.env.SMTP_MAIL)
// console.log("SMTP PASSWORD",process.env.SMTP_PASSWORD)
    const mailoptions = {
        from: process.env.SMTP_MAIL,
        to: Options.email,
        subject:Options.subject,
        text:Options.message,
    };
    //console.log("Mailoptions",mailoptions)
    //console.log("Sending email to", Options.email)
    await transporter.sendMail(mailoptions)
    //console.log("Email is successfukky to:", Options.email)
}
catch(error){
    console.log("Error is sending email:", error)
    throw new Error(`Failed to send to email: ${error.message}`)
}
}