// app/admin/dashboard/DashboardContent.js
'use client';
import { signOut } from "next-auth/react";
import Head from "next/head";

// Ce composant reçoit les réservations comme une prop
export default function DashboardContent({ reservations, userEmail }) {
  return (
    <>
      <Head>
        <title>Tableau de bord Admin</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-4">
            Bienvenue, {userEmail}
          </h1>
          <p className="mb-4">
            Ceci est le tableau de bord des réservations.
          </p>

          <div className="container mx-auto">
            <h2 className="text-xl font-bold mb-6">Demandes de réservations</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de la demande</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{reservation.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reservation.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Du {new Date(reservation.startDate).toLocaleDateString()} au {new Date(reservation.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          reservation.status === 'en attente' ? 'bg-yellow-100 text-yellow-800' :
                          reservation.status === 'validée' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(reservation.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {reservations.length === 0 && (
              <p className="text-center text-gray-500 mt-8">Aucune demande de réservation pour le moment.</p>
            )}
          </div>

          <button
            onClick={() => signOut()}
            className="mt-6 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </>
  );
}
