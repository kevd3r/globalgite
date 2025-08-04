// app/admin/dashboard/page.js
// Pas de 'use client' ici, c'est un composant serveur
import { PrismaClient } from '../../../generated/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DashboardContent from "./DashboardContent"; // Importer le composant client

const prisma = new PrismaClient();

export default async function AdminDashboardPage() {
  // Vérification de la session côté serveur
  const session = await getServerSession(authOptions);

  // Si l'utilisateur n'est pas authentifié, le rediriger
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Récupérer toutes les réservations depuis la base de données
  const reservations = await prisma.reservation.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Passer les données au composant client pour l'affichage
  return <DashboardContent reservations={reservations} userEmail={session.user.email} />;
}
