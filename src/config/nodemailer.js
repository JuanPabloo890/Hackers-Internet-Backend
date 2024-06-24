import nodemailer from 'nodemailer';
import Cliente from '../models/Clientes.js'; // Asegúrate de que la ruta es correcta
import Equipo from '../models/Equipo.js'; // Asegúrate de que la ruta es correcta
import Mantenimiento from '../models/Mantenimiento.js';

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

const sendStatusEmail = async (id_equipo) => {
  try {
    // Obtener información del equipo
    const equipo = await Equipo.findById(id_equipo);
    if (!equipo) {
      throw new Error('Equipo no encontrado');
    }

    // Obtener información del cliente
    const cliente = await Cliente.findById(equipo.id_cliente);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    // Obtener la información más reciente del mantenimiento
    const mantenimiento = await Mantenimiento.findByEquipoId(id_equipo);
    if (!mantenimiento) {
      throw new Error('Mantenimiento no encontrado');
    }

    // Crear el contenido del correo
    const mailOptions = {
      from: 'hackersInternet@gmail.com',
      to: cliente.correo,
      subject: 'Estado Actual de su Equipo',
      html: `
        <h1>Hola ${cliente.nombre},</h1>
        <p>Queremos informarle sobre el estado actual de su equipo:</p>
        <p><strong>Equipo:</strong> ${equipo.marca} ${equipo.modelo}</p>
        <p><strong>Estado Actual:</strong> ${mantenimiento.estado_actual}</p>
        <p><strong>Observaciones:</strong> ${mantenimiento.descripcion}</p>
        <hr>
        <footer>Saludos, Hackers Internet</footer>
      `
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado satisfactoriamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

export {
  sendMail,
  sendMailToRecoveryPassword,
  sendStatusEmail
}
