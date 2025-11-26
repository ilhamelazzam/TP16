import { gql } from "@apollo/client";

// Mutation pour créer un compte
export const SAVE_COMPTE = gql`
  mutation SaveCompte($compte: CompteRequest!) {
    saveCompte(compte: $compte) {
      id
      solde
      dateCreation
      type
    }
  }
`;

export const UPDATE_COMPTE = gql`
  mutation UpdateCompte($id: ID!, $solde: Float, $type: TypeCompte) {
    updateCompte(id: $id, solde: $solde, type: $type) {
      id
      solde
      dateCreation
      type
    }
  }
`;


// Mutation pour supprimer un compte
export const DELETE_COMPTE = gql`
  mutation DeleteCompte($id: ID!) {
    deleteCompte(id: $id)
  }
`;

// ❌ Mutation transactionnelle commentée : le backend ne l'expose pas
/*
export const ADD_TRANSACTION = gql`
  mutation AddTransaction($transactionRequest: TransactionRequest!) {
    addTransaction(transactionRequest: $transactionRequest) {
      id
      type
      montant
      date
      compte {
        id
        solde
        type
      }
    }
  }
`;
*/
