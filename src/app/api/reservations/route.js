// app/api/reservations/route.js
import { PrismaClient } from '../../../generated/prisma';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, email, phone, message, startDate, endDate } = await req.json();

    // 1. Sauvegarder la réservation dans la base de données
    const reservation = await prisma.reservation.create({
      data: {
        name,
        email,
        phone,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        message,
        status: 'en attente',
      },
    });

    // 2. Envoyer l'e-mail de confirmation à l'administrateur
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // Assurez-vous d'avoir une variable pour l'hôte
      port: process.env.EMAIL_PORT, // et une pour le port
      secure: process.env.EMAIL_SECURE === 'true', // et pour la sécurité
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_ADMIN,
      subject: `Nouvelle demande de réservation (#${reservation.id}) de ${name}`,
      html: `
        <h1>Nouvelle demande de réservation</h1>
        <p><strong>Numéro de réservation :</strong> #${reservation.id}</p>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone}</p>
        <p><strong>Dates de réservation :</strong> Du ${startDate} au ${endDate}</p>
        <p><strong>Message :</strong> ${message}</p>
        <p><strong>Statut :</strong> En attente</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Demande de réservation enregistrée et envoyée !" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Erreur lors de l'enregistrement de la demande." }, { status: 500 });
  }
}