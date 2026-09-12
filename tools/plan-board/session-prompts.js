// Ce que le board tape dans la session qu'il ouvre. Ce ne sont pas des consignes mais des skills du
// dépôt : chacun retrouve sa tâche depuis l'id de la session, donc le prompt n'a rien à porter.
// Partagé par le serveur, qui montre la commande, et par les boutons qui la déclenchent.
const START_PROMPT = '/start-task';
const COMMIT_PROMPT = '/commit-task';

if (typeof module !== 'undefined') module.exports = { START_PROMPT, COMMIT_PROMPT };
