// app/api/send-email/route.js
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name, email, phone, message, startDate, endDate } = await req.json();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_ADMIN,
      subject: `Nouvelle demande de réservation de ${name}`,
      html: `
        <h1>Nouvelle demande de réservation</h1>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone}</p>
        <p><strong>Dates de réservation souhaitées :</strong></p>
        <ul>
          <li><strong>Du :</strong> ${startDate}</li>
          <li><strong>Au :</strong> ${endDate}</li>
        </ul>
        <p><strong>Message :</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Demande envoyée avec succès !" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Erreur lors de l'envoi de la demande." }, { status: 500 });
  }
}