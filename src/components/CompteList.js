import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_ALL_COMPTES } from "../graphql/queries";
import { UPDATE_COMPTE, DELETE_COMPTE } from "../graphql/mutations";
import { TypeCompte } from "../graphql/types";

const CompteList = () => {
  const [editId, setEditId] = useState(null);
  const [editSolde, setEditSolde] = useState("");
  const [editType, setEditType] = useState(TypeCompte.COURANT);
  const [message, setMessage] = useState(null);

  const { loading, error, data } = useQuery(GET_ALL_COMPTES);
  const [updateCompte, { loading: updating }] = useMutation(UPDATE_COMPTE, {
    refetchQueries: [{ query: GET_ALL_COMPTES }],
  });
  const [deleteCompte, { loading: deleting }] = useMutation(DELETE_COMPTE, {
    refetchQueries: [{ query: GET_ALL_COMPTES }],
  });

  const startEdit = (compte) => {
    setEditId(compte.id);
    setEditSolde(compte.solde);
    setEditType(compte.type);
    setMessage(null);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      `Supprimer le compte #${id} ? Cette action est définitive.`
    );
    if (!confirm) return;
    setMessage(null);
    try {
      await deleteCompte({ variables: { id } });
      setMessage({ type: "success", text: "Compte supprimé." });
      if (editId === id) {
        cancelEdit();
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du compte :", err);
      setMessage({ type: "error", text: "Échec de la suppression." });
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditSolde("");
    setEditType(TypeCompte.COURANT);
    setMessage(null);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editId) return;
    setMessage(null);
    try {
      await updateCompte({
        variables: {
          id: editId,
          solde: parseFloat(editSolde),
          type: editType,
        },
      });
      setMessage({ type: "success", text: "Compte mis a jour." });
      cancelEdit();
    } catch (err) {
      console.error("Erreur lors de la mise a jour du compte :", err);
      setMessage({ type: "error", text: "Echec de la mise a jour." });
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-4">Chargement des comptes...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-500 mt-4">
        Erreur : {error.message}
      </p>
    );
  }

  if (!data || data.allComptes.length === 0) {
    return (
      <div className="mt-6 bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Liste des comptes
        </h2>
        <p className="text-gray-500">Aucun compte pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Liste des comptes
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
      <div className="space-y-3">
        {data.allComptes.map((compte) => (
          <div
            key={compte.id}
            className="border rounded-md p-3 flex justify-between items-center hover:bg-slate-50 transition"
          >
            <div>
              <p className="text-sm text-gray-500">ID : {compte.id}</p>
              <p className="font-semibold text-gray-800">
                Solde : {compte.solde} EUR
              </p>
              <p className="text-sm text-gray-600">
                Date de creation :{" "}
                {new Date(compte.dateCreation).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  compte.type === "COURANT"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {compte.type}
              </span>
              <button
                type="button"
                onClick={() => startEdit(compte)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={() => handleDelete(compte.id)}
                disabled={deleting}
                className="text-sm text-red-600 hover:text-red-800 disabled:opacity-60"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {editId && (
        <form onSubmit={submitEdit} className="mt-6 space-y-4 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Modifier le compte #{editId}
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau solde
            </label>
            <input
              type="number"
              step="0.01"
              value={editSolde}
              onChange={(e) => setEditSolde(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de compte
            </label>
            <select
              value={editType}
              onChange={(e) => setEditType(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={TypeCompte.COURANT}>Courant</option>
              <option value={TypeCompte.EPARGNE}>Epargne</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={updating}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {updating ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CompteList;
