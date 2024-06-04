import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: "baltasar0017@gmail.com",
        pass: "xfdm hboc kint xcno"
    }
})

const sendEmailChangePassword = async(email, linkChangePassword) => {
    const mailOption = {
        from: "baltasar0017@gmail.com",
        to: email,
        subject: "Recuperacion de contraseña",
        text: 
        `
            Haz click en el siguiente enlace para cambiar tu contraseña: 
            ${linkChangePassword}

        `,
        html:
        `
            <p>Haz click aquí para cambiar tu contraseña</p> 
            <button> <a href=${linkChangePassword}>Cambiar contraseña</a> <button>

        `
    }

    transporter.sendMail(mailOption, (error, info)=> {
        if(error) {
            console.log(error)
        } else {
            console.log("Correo enviado correctamente")
        }
    })
}

export {sendEmailChangePassword}