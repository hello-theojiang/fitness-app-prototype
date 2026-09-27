/* ============================================================
   Pulse — vues légales : Mentions légales & CGU.
   Les champs d'identification de l'éditeur sont marqués
   [À compléter] — à remplir avant toute mise en production.
   ============================================================ */

const LegalView = (() => {
  const T = `<span class="todo-field">[À compléter]</span>`;

  const MENTIONS = `
    <div class="legal card">
      <h2>Éditeur de l'application</h2>
      <p>Pulse — Application de suivi fitness et nutrition (prototype).</p>
      <p>Éditeur : ${T} (nom / raison sociale)<br/>
      Adresse : ${T}<br/>
      Contact : ${T} (adresse e-mail)<br/>
      Directeur de la publication : ${T}</p>

      <h2>Hébergement</h2>
      <p>L'application est un prototype distribué à des fins de démonstration.<br/>
      Hébergeur : ${T} (nom, adresse, téléphone de l'hébergeur)</p>

      <h2>Propriété intellectuelle</h2>
      <p>L'ensemble des éléments de l'application (interface, textes, icônes, programmes) est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable est interdite.</p>

      <h2>Données personnelles</h2>
      <p>Dans cette version prototype, toutes les données saisies (journal nutrition, programme actif, historique du coach) sont stockées <strong>localement sur l'appareil de l'utilisateur</strong> et ne sont transmises à aucun serveur.</p>
      <p>Lorsque des fonctionnalités en ligne seront activées (comptes, coach IA distant), une politique de confidentialité conforme au RGPD sera publiée et le consentement sera recueilli.</p>
      <p>Droits des utilisateurs : accès, rectification, effacement — contact : ${T}.</p>

      <h2>Cookies</h2>
      <p>L'application n'utilise pas de cookies de suivi ni de cookies tiers.</p>
    </div>`;

  const CGU = `
    <div class="legal card">
      <h2>1. Objet</h2>
      <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de l'application Pulse, un outil de suivi de nutrition, de programmes sportifs et d'assistance par intelligence artificielle.</p>

      <h2>2. Acceptation</h2>
      <p>L'utilisation de l'application implique l'acceptation pleine et entière des présentes CGU. Si l'utilisateur n'accepte pas ces conditions, il doit cesser toute utilisation.</p>

      <h2>3. Description du service</h2>
      <ul>
        <li>Suivi nutritionnel : journal des repas, calories et macronutriments.</li>
        <li>Programmes d'entraînement : bibliothèque de séances avec muscles ciblés.</li>
        <li>Coach IA : assistant conversationnel s'appuyant sur les données de l'utilisateur.</li>
        <li>Offres payantes (à venir) : plans Pro et Elite décrits dans la page Pricing.</li>
      </ul>

      <h2>4. Avertissement santé</h2>
      <p>L'application et le coach IA fournissent des informations générales de remise en forme. Ils ne remplacent en aucun cas un avis médical, un diagnostic ou un traitement. L'utilisateur doit consulter un professionnel de santé avant de commencer tout programme sportif ou changement alimentaire important.</p>

      <h2>5. Comportements interdits</h2>
      <ul>
        <li>Utiliser l'application à des fins illégales ou nuisibles.</li>
        <li>Tenter de contourner les mécanismes techniques ou de perturber le service.</li>
        <li>Reproduire ou exploiter commercialement le contenu sans autorisation.</li>
      </ul>

      <h2>6. Abonnements et paiements</h2>
      <p>Les plans payants (Pro, Elite) seront soumis à des conditions de facturation précisées lors de leur activation : prix, périodicité, résiliation, droit de rétractation (14 jours pour les services numériques non exécutés).</p>

      <h2>7. Responsabilité</h2>
      <p>L'éditeur s'efforce d'assurer l'exactitude des informations mais ne garantit pas l'absence d'erreurs. L'utilisation des conseils nutritionnels et sportifs se fait sous la seule responsabilité de l'utilisateur.</p>

      <h2>8. Données personnelles</h2>
      <p>Voir la section « Données personnelles » des Mentions légales. En version prototype, les données restent sur l'appareil.</p>

      <h2>9. Modification des CGU</h2>
      <p>L'éditeur peut modifier les présentes CGU à tout moment. La version en vigueur est celle accessible dans l'application.</p>

      <h2>10. Droit applicable</h2>
      <p>Les présentes CGU sont soumises au droit français. Tout litige sera soumis aux tribunaux compétents du ressort de ${T}.</p>
    </div>`;

  function render(el, params) {
    const page = params && params[0];
    if (page === "cgu") {
      el.innerHTML = `
        <div class="view-header">
          <div class="view-eyebrow">Légal</div>
          <h1 class="view-title">Conditions Générales d'Utilisation</h1>
          <p class="view-subtitle">Dernière mise à jour : septembre 2026 — version prototype.</p>
        </div>
        ${CGU}`;
    } else {
      el.innerHTML = `
        <div class="view-header">
          <div class="view-eyebrow">Légal</div>
          <h1 class="view-title">Mentions légales</h1>
          <p class="view-subtitle">Informations sur l'éditeur et l'hébergement de l'application.</p>
        </div>
        ${MENTIONS}`;
    }
  }

  return { render };
})();
