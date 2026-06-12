# 📂 Portfolio Professionnel - Dan Bitton

Ce projet est le portfolio professionnel et académique de **Dan Bitton**, étudiant en **Bachelor Concepteur Développeur Web Full Stack (CDWFS)**. Il regroupe son parcours (BTS SIO option SLAM), ses compétences, ses expériences (stage chez RIVP) et ses projets phares.

---

## 📋 Historique des Consignes & Demandes d'Intégration

Ce document récapitule l'ensemble des consignes et améliorations demandées au cours du développement pour obtenir un rendu moderne et professionnel :

### 1. Modernisation Graphique (Style Sombre & Cyber)
*   **Consigne :** Donner un aspect haut de gamme et moderne au portfolio en adoptant une charte sombre et futuriste, similaire au style développé pour les projets principaux.
*   **Solution :**
    *   Mise en place d'une charte sombre basée sur les polices *Outfit*, *Poppins* et *Fira Code*.
    *   Ajout d'effets de **Glassmorphism** (cartes floutées translucides avec bordures lumineuses).
    *   Intégration de **blobs décoratifs fluorescents** (`.blob-1` cyan et `.blob-2` violet) flottant en arrière-plan sur toutes les pages (`index.html`, `veliko.html`, `invitation.html` et `stage.html`).

### 2. Automatisation & Dépôts GitHub Dynamiques
*   **Consigne :** Présenter les projets et faire en sorte que les dépôts GitHub s'affichent automatiquement sans mise à jour manuelle du code.
*   **Solution :** 
    *   Développement d'un script d'intégration avec l'API REST de GitHub (`js/index.js`) récupérant en temps réel les 6 dépôts publics les plus récemment mis à jour de l'utilisateur `DanBttn`.
    *   Génération automatique des cartes avec tags de langages, statistiques (stars, forks) et visuels OpenGraph générés dynamiquement par GitHub.

### 3. Alignement & Cohérence des Pages Projets
*   **Consigne :** Concevoir des pages projets dédiées pour **Véliko** et **Invitation** qui reprennent exactement la même charte graphique épurée et le même système de grille.
*   **Solution :** 
    *   Création de [veliko.html](veliko.html) et [invitation.html](invitation.html) utilisant le système de grille globale et les variables CSS unifiées dans [index.css](css/index.css).
    *   Refonte des titres de sections pour adopter une structure premium : sous-titre coloré, titre principal et ligne de soulignement en dégradé de couleur.

### 4. Présentation Mobile & Vraies Captures d'Écran (Projet Invitation)
*   **Consigne :** Corriger l'affichage du projet Invitation. Les captures ne doivent pas être rognées horizontalement mais présentées verticalement comme sur un téléphone portable, en utilisant les vrais visuels de l'application (l'enveloppe fermée, le faire-part ouvert et le formulaire de présence).
*   **Solution :**
    *   **Captures réelles :** Lancement d'un serveur Flask local temporaire en arrière-plan et exécution de Google Chrome en mode *headless* (émulation mobile $375 \times 812$) pour capturer les trois vraies étapes du parcours invité.
    *   **Maquettes de Smartphones :** Création de conteneurs CSS `.phone-frame` imitant des smartphones (châssis sombre, encoche/notch caméra supérieure, reflet vitré au survol, arrondis marqués et ombres portées réactives).

### 5. Correction de la Taille des Logos & Visuels
*   **Consigne :** Ajuster et corriger les tailles disproportionnées de certains logos et images qui dépassaient de l'écran ou cassaient le layout (notamment sur le logo Twig et les visuels de démonstration).
*   **Solution :**
    *   Nettoyage des styles en ligne (`style="width: auto"`) pour forcer l'usage du système de tailles CSS (`width: 40px` max pour les icônes de compétences).
    *   Remplacement des émojis de repli (`🧪` et `📊`) par des icônes SVG vectorielles personnalisées et colorées pour Flask et Excel/Pandas.
    *   Correction du libellé "HTML" en "Twig" dans la section des outils de Véliko.

### 6. Gestion du Formulaire d'Invitation (RSVP)
*   **Consigne :** Expliquer où et comment sont reçues les informations soumises via le formulaire d'invitation.
*   **Solution :**
    *   Le backend Flask (`app.py`) traite les requêtes de manière asynchrone.
    *   Les réponses sont lues, validées (téléphone à 10 chiffres obligatoire, nom/prénom requis) et enregistrées dans un fichier Excel local nommé `reponse.xlsx`.
    *   Le script utilise la bibliothèque Pandas pour calculer dynamiquement le total général des personnes présentes et met à jour en temps réel la cellule `D2` via OpenPyXL.
    *   Une gestion des erreurs d'accès (`PermissionError`) a été intégrée pour avertir les utilisateurs si le fichier Excel est actuellement verrouillé ou ouvert par l'administrateur.

---

## 🛠️ Technologies Utilisées

*   **Structure :** HTML5 sémantique.
*   **Design & Layouts :** CSS3 natif (Flexbox, CSS Grid, Variables, Animations).
*   **Dynamisme :** JavaScript (ES6+, Fetch API, Intersection Observer pour les animations au défilement).
*   **Backend (Invitation) :** Python 3, Flask, Pandas, OpenPyXL, Excel.
