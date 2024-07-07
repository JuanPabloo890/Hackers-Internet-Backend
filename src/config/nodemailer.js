import nodemailer from 'nodemailer';
import Equipo from '../models/Equipos.js';
import Cliente from '../models/Clientes.js';

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

const notificarCliente = async (req, res) => {
  const { id_equipo } = req.params;

  try {
    // Obtener la información del equipo
    const equipo = await Equipo.findById(id_equipo);
    if (!equipo) {
      return res.status(404).json({ msg: 'Equipo no encontrado' });
    }

    // Obtener la información del cliente
    const cliente = await Cliente.findById(equipo.id_cliente);
    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente no encontrado' });
    }

    // Enviar el correo electrónico
    const mailOptions = {
      from: 'hackersInternet@gmail.com',
      to: cliente.correo,
      subject: 'Estado de su equipo',
      text: `
        Hola ${cliente.nombre},

        Aquí está el estado actual de su equipo:

        Marca: ${equipo.marca}
        Estado: ${equipo.estado}
        Observaciones: ${equipo.observaciones}

        Si tiene alguna pregunta, no dude en contactarnos.

        Contactanos con el siguiente link
        https://wa.me/5930987547665

        Saludos,
        Hackers Internet 🤖🦾
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ msg: 'Correo enviado exitosamente' });
  } catch (error) {
    console.error('Error al notificar al cliente:', error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

export {
  sendMail,
  sendMailToRecoveryPassword,
  notificarCliente
}
