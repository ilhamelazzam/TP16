/**
 * @typedef {Object} Compte
 * @property {string} id
 * @property {number} solde
 * @property {string} dateCreation
 * @property {'COURANT' | 'EPARGNE'} type
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {'DEPOT' | 'RETRAIT'} type
 * @property {number} montant
 * @property {string} date
 * @property {Compte} compte
 */

/**
 * @typedef {Object} SoldeStats
 * @property {number} count
 * @property {number} sum
 * @property {number} average
 */

/**
 * @typedef {Object} TransactionStats
 * @property {number} count
 * @property {number} sumDepots
 * @property {number} sumRetraits
 */

/**
 * @typedef {Object} CompteRequest
 * @property {number} solde
 * @property {'COURANT' | 'EPARGNE'} type
 */

/**
 * @typedef {Object} TransactionRequest
 * @property {'DEPOT' | 'RETRAIT'} type
 * @property {number} montant
 * @property {string} compteId
 */
