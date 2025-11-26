import React from "react";
import { useQuery } from "@apollo/client/react";
import { GET_ALL_TRANSACTIONS } from "../graphql/queries";

const TransactionList = () => {
  const { loading, error, data } = useQuery(GET_ALL_TRANSACTIONS);

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-4">
        Chargement des transactions...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 mt-4">
        Erreur : {error.message}
      </p>
    );
  }

  if (!data || data.allTransactions.length === 0) {
    return (
      <div className="mt-6 bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Historique des transactions
        </h2>
        <p className="text-gray-500">Aucune transaction pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Historique des transactions
      </h2>
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {data.allTransactions.map((t) => (
          <div
            key={t.id}
            className="border rounded-md p-3 flex justify-between items-center hover:bg-slate-50 transition"
          >
            <div>
              <p className="text-sm text-gray-500">ID : {t.id}</p>
              <p className="font-semibold text-gray-800">
                {t.type === "DEPOT" ? "Dépôt" : "Retrait"} : {t.montant} €
              </p>
              <p className="text-sm text-gray-600">
                Date : {new Date(t.date).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                Compte : {t.compte?.id} — {t.compte?.type}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                t.type === "DEPOT"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {t.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
