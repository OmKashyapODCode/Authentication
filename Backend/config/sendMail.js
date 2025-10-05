import {createTransport} from "nodemailer";

const sendMail = async({email,subject,html})=>{
    const transport = createTransport({
        host : "smtp.gmail.com",
        port :465,
        auth : {
            user : "ouvanjl",
            pass : "ur_password",
        },
    })
    await transport.sendMail({
        from : "ouvanjl",
        to : email,
        subject,
        html,
    })
}


export default sendMail;
