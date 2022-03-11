# Gestion des contacts

La gestion des contacts est un point central de la gestion des noms de domaine.
Pour la majorité des extensions, il y a 3 contacts différents configurable chez le registre :

- Propriétaire : Représente la personne physique ou moral détenteur du nom de domaine. Celui-ci est souvent contraint à des [règles d'éligibilités](rules)). Il est celui qui est légalement responsable du domaine.
- Technique : Contact qui gère la partie technique du domaine (gestion de la zone notaemment).
- Admnistrateur : Contact qui gère le domaine dans sa globalité (gestion du contact propriétaire, contact technique). Il est le principal interlocuteur du registrar.

Par exemple, Bob contacte une agence web pour lui créer son site web vitrine pour sa petite entreprise. Dans ce cas là, l'agence web organisera les contacts de cette manière :

- Propriétaire : Bob
- Technique : L'agence web
- Administrateur : L'agence web

Il est très fréquent que le contact technique soit le même que le contact administrateur. Concernant le propriétaire, il est nécessaire que ce soit Bob. En cas de litige avec l'agence web, seul le fait d'être propriétaire du domaine aura une porté juridique et lui permettra la récupération du nom de domaine.

Avant d'aller plus loin, il est important de comprendre les différences entre les _nichandle_ (ou compte OVHcloud) et les contacts whois.

## Nichandle OVHcloud

Le nichandle OVHcloud représente le compte OVHcloud grâce auxquel il est possible de se connecter au site OVHcloud et à l'api.
Sur un service OVHcloud (domain, dns, serveur, autre), il est possible d'affecter un nichandle en tant que:

- Nic Admin : C'est l'administrateur du domaine, il possède la possibilité de faire toute les actions possible sur un domaine
- Nic Tech : Ce nic, désigné par le NicAdmin pour un service, a la possibilité de modifier des données techniques sur le service
- Nic Billing : C'est le responsable facturation du service.

Par défaut, un NicAdmin est également Tech et Billing d'un service.

## Contact whois

Ces contacts sont ceux présents dans le whois ou le fichier RDAP.
Nous allons rester sur le cas des (n)gtlds. Les cctlds ayant parfois des particularités que nous n'évoquerons pas ici pour des raisons de simplicité (et que l'api vous cache le plus possible de toute façon).

Comme dit précédement, un domain possède ces 3 différents contacts :

- Un contact administratif
- Un contact technique
- Un contact propriétaire (ou titulaire)

### Relation entre nic OVH et contacts whois

Il existe un lien fort entre les nic OVH et les contacts whois/RDAP, le nic OVH Admin et le nic OVH Tech sont synchronisés avec les contacts whois admin et tech.

Le contact propriétaire (ou registre) n'est pas lié un nichandle OVHcloud. Il est lié à un autre objet de l'api ("domain.Contact"). Vous ne pouvez pas vous connecté à l'api ou au interface d'OVHCloud avec celui-ci.

## Création d'un nouveau nic

L'api suivante permet de créer un nichandle OVH.

[`POST /newAccount`](https://api.ovh.com/console/#/newAccount~POST)

Il est également possible de récupérer les règles de création via l'api [`GET /newAccount/creationRules`](/newAccount/creationRules)

Une fois créé, toutes actions lié à ce nichandle ce fera via les `/me/*`

## Récupération et modification d'un nic

Vous pouvez récupérer et modifier les informations d'un nic via ces apis :

[`GET /me`]](https://api.ovh.com/console/#/me~GET)
[`PUT /me`]](https://api.ovh.com/console/#/me~PUT)

## Contact propriétaire

Le contact propriétaire est représenté à la fois par les routes /me/contact et /domain/contacts. Ces deux endpoints partagent les mêmes identifiants.
Historiquement, toutes les actions étaient faisable via /me/contact. Cependant, certaines règles métiers lié uniquement au métier de nom de domaine nous ont contraint de déployer une nouvelle api spécifique sous `/domain/contact`. Celle-ci représente une surcouche aux apis /me/contact et nous permet d'ajouter des champs supplémentaire nécessaire à certaines extension.

Pour une utilisation de contact dans un contexte de noms de domaine, nous vous conseillons fortement l'utilisation des apis /domain/contacts.

Lors de la commande d'un nom de domaine, le contact propriétaire est dupliqué afin de toujours avoir un idenfiant unique par domaine. Cela facilite la gestion de mise à jour par la suite.

## CRUD d'un contact

Les APIs suivantes vous permettent de gérer vos contacts :

Récupération de vos contacts: [`GET /domain/contact`](https://api.ovh.com/console/#/domain/contact~GET)
Création d'un contact : [`POST /domain/contact`](https://api.ovh.com/console/#/domain/contact~POST)
Récupération d'un contact : [`GET /domain/contact/{contactId}`](https://api.ovh.com/console/#/domain/contact/{contactId}~GET)
Modification d'un contact : [`PUT /domain/contact/{contactId}`](/domain/contact/{contactId})

## Changement de contact propriétaire

// TODO: Expliquer qu'un changement de contact propriétaire pour une extension lié à l'icann demande un process particulier.

- Qu'un changement d'email est considéré comme un changement de propriétaire.
- On matérialise le changement de contact via un BC qui permet de:
  - Revalider les contrats légales lié au propriétaire si besoin
  - Facturer le service pour les registres ayant des coût de changement de propriétaire et/ou des process manuel
- Expliquer la commande de changement de propriétaire (api order serviceOption, rappelez que la gestion des règles est déjà décrite dans rules.md)
- Expliquer qu'une opération de DomainTrade est visible sur le manager une fois le BC validé et pris en compte par notre SI.
  - Que cette opération demandera confirmation à l'actuelle registrant (via son adresse mail)

## Changement de nic sur le service domaine

// TODO: Expliquer le workflow de la procédure de changement de nic sur un service

// TODO: Expliquer les api sur comment déclencher la procédure et comment la suivre
Launch a contact change procedure
POST /domain/zone/{zoneName}/changeContact

GET /me/task/contactChange
List of service contact change tasks you are involved in
GET /me/task/contactChange/{id}
Get this object properties
POST /me/task/contactChange/{id}/accept
Accept this change request
POST /me/task/contactChange/{id}/refuse
Refuse this change request
POST /me/task/contactChange/{id}/resendEmail
