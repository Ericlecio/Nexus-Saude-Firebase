const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "seuemail@gmail.com",
      pass: "suasenha",
    },
  });

  const mailOptions = {
    from: email,
    to: "lrs15@discente.ifpe.edu.br",
    subject: `Nova mensagem de contato de ${name}`,
    text: `Nome: ${name}\nE-mail: ${email}\nMensagem: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("E-mail enviado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.status(500).send("Erro ao enviar e-mail.");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
