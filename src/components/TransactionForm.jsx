import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { ADD_TRANSACTION } from "../graphql/mutations";
import { GET_ALL_COMPTES, GET_ALL_TRANSACTIONS } from "../graphql/queries";
import { TypeTransaction } from "../graphql/types";

const TransactionForm = () => {
  const [type, setType] = useState(TypeTransaction.DEPOT);
  const [montant, setMontant] = useState("");
  const [compteId, setCompteId] = useState("");
  const [message, setMessage] = useState(null);

  const {
    data: comptesData,
    loading: comptesLoading,
    error: comptesError,
  } = useQuery(GET_ALL_COMPTES);

  const [addTransaction, { loading: saving }] = useMutation(ADD_TRANSACTION, {
    refetchQueries: [
      { query: GET_ALL_TRANSACTIONS },
      { query: GET_ALL_COMPTES },
    ],
  });

  useEffect(() => {
    if (!compteId && comptesData?.allComptes?.length) {
      setCompteId(String(comptesData.allComptes[0].id));
    }
  }, [compteId, comptesData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!compteId) {
      setMessage({
        type: "error",
        text: "Veuillez sélectionner un compte.",
      });
      return;
    }

    try {
      await addTransaction({
        variables: {
          transactionRequest: {
            type,
            montant: parseFloat(montant),
            compteId,
          },
        },
      });

      setMontant("");
      setType(TypeTransaction.DEPOT);
      setMessage({
        type: "success",
        text: "Transaction enregistrée avec succès.",
      });
    } catch (err) {
      console.error("Erreur lors de l'ajout de la transaction :", err);
      setMessage({
        type: "error",
        text: "Erreur lors de l'ajout de la transaction.",
      });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Ajouter une transaction
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

      {comptesError && (
        <p className="text-red-600 mb-3">
          Impossible de charger les comptes : {comptesError.message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de transaction
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={TypeTransaction.DEPOT}>Dépôt</option>
            <option value={TypeTransaction.RETRAIT}>Retrait</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Montant
          </label>
          <input
            type="number"
            step="0.01"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            required
            placeholder="Entrez le montant"
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Compte
          </label>
          <select
            value={compteId}
            onChange={(e) => setCompteId(e.target.value)}
            disabled={comptesLoading}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="">
              {comptesLoading ? "Chargement..." : "Sélectionner un compte"}
            </option>
            {comptesData?.allComptes?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.type} — Solde: {c.solde}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={saving || comptesLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Enregistrement..." : "Valider la transaction"}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
