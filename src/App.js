import React from "react";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./apollo/client";
import CompteList from "./components/CompteList";
import CreateCompte from "./components/CreateCompte";
import "./App.css";

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Gestion des Comptes Bancaires
          </h1>

          <div className="max-w-4xl mx-auto space-y-6">
            <CreateCompte />
            <CompteList />
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
