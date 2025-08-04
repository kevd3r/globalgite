// app/reservation/page.js
"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Head from "next/head";

export default function Reservation() {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  // Utiliser watch pour récupérer la valeur de startDate en temps réel
  const startDate = watch("startDate");
  const today = new Date().toISOString().split('T')[0];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setStatus(null);

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <Head>
        <title>Demande de réservation</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center">Demande de réservation</h2>
          {status === "success" && (
            <p className="text-center text-green-500">Votre demande a été envoyée avec succès !</p>
          )}
          {status === "error" && (
            <p className="text-center text-red-500">Une erreur est survenue. Veuillez réessayer.</p>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom et prénom</label>
              <input
                id="name"
                {...register("name", { required: "Le nom est requis" })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
              <input
                id="email"
                type="email"
                {...register("email", { required: "L'e-mail est requis" })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
              <input
                id="phone"
                type="tel"
                {...register("phone")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Date de début</label>
                <input
                  id="startDate"
                  type="date"
                  min={today} // Limite visuelle du calendrier
                  {...register("startDate", {
                    required: "La date de début est requise",
                    validate: (value) => value >= today || "La date de début doit être aujourd'hui ou dans le futur"
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.startDate && <span className="text-red-500 text-sm mt-1">{errors.startDate.message}</span>}
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Date de fin</label>
                <input
                  id="endDate"
                  type="date"
                  min={startDate} // Limite visuelle : la date de fin ne peut pas être avant la date de début
                  {...register("endDate", {
                    required: "La date de fin est requise",
                    validate: (value) => {
                      // S'assurer que startDate est définie et que endDate est au moins un jour après
                      const start = new Date(startDate);
                      const end = new Date(value);
                      const diffTime = Math.abs(end - start);
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays >= 1 || "La date de fin doit être au moins un jour après la date de début";
                    }
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.endDate && <span className="text-red-500 text-sm mt-1">{errors.endDate.message}</span>}
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Votre message</label>
              <textarea
                id="message"
                rows="4"
                {...register("message")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}