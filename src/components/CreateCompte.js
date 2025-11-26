import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { SAVE_COMPTE } from "../graphql/mutations";
import { GET_ALL_COMPTES } from "../graphql/queries";
import { TypeCompte } from "../graphql/types";

const CreateCompte = () => {
  const [solde, setSolde] = useState("");
  const [type, setType] = useState(TypeCompte.COURANT);
  const [message, setMessage] = useState(null);

  const [saveCompte, { loading }] = useMutation(SAVE_COMPTE, {
    refetchQueries: [{ query: GET_ALL_COMPTES }],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      await saveCompte({
        variables: {
          compte: {
            solde: parseFloat(solde),
            type,
          },
        },
      });

      setSolde("");
      setType(TypeCompte.COURANT);
      setMessage({ type: "success", text: "Compte créé avec succès ✅" });
    } catch (error) {
      console.error("Erreur lors de la création du compte :", error);
      setMessage({
        type: "error",
        text: "Erreur lors de la création du compte",
      });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Créer un nouveau compte
      </h2>

      {message && (
        <div
          className={`mb-3 text-sm px-3 py-2 rounded ${
            message.type === "success"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Solde initial
          </label>
          <input
            type="number"
            value={solde}
            onChange={(e) => setSolde(e.target.value)}
            required
            placeholder="Entrez le solde initial"
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de compte
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={TypeCompte.COURANT}>Courant</option>
            <option value={TypeCompte.EPARGNE}>Épargne</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Création en cours..." : "Créer le compte"}
        </button>
      </form>
    </div>
  );
};

export default CreateCompte;
