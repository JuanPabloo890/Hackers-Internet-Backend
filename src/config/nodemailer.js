import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // esto es el servicio de correo que se este usando 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (password, userMailer) => {
  const mailOptions = {
    from: 'hackersInternet@gmail.com',
    to: userMailer,
    subject: "Contraseña para inicio de sesión",
    html:`
    <h1>Bienvenido a Hackers Internet 🦾 </h1>
    <p>Tu contraseña para iniciar sesión es: ${password}</p>
    <footer>Un hacker te Saluda 🤖!</footer>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendMailToRecoveryPassword = async (userMail, newPassword) => {
  let info = await transporter.sendMail({
    from: 'hackersInternet@gmail.com',
    to: userMail,
    subject: "Nueva contraseña temporal",
    html: `
      <h1>Hackers Internet🤖</h1>
      <hr>
      <p>Tu nueva contraseña temporal es: <strong>${newPassword}</strong></p>
      <p>Por favor, cambia esta contraseña después de iniciar sesión.</p>
      <hr>
      <footer>Cuida la contraseña!😤 </footer>
    `
  });
  console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
};

export {
  sendMail,
  sendMailToRecoveryPassword,
}
