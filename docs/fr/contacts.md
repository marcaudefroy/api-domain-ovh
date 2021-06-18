# Gestion des contacts

La gestion des contacts est un point central de la gestion des noms de domaine. 


## Introduction

Avant d'aller plus loin, il est important de différencier les deux différents type de contacts.

D'un côté, il y a les *nic* OVH d'un service OVH (ici domaine). 

### Nichandle OVH

Il est possible, à travers eux, de se connecter au manager OVH ou à l'api et sont divisés en trois sous-types différents :

- Le Nic Admin : C'est l'administrateur du domaine, il possède la possibilité de faire toute les actions possible sur un domaine
- Le Nic Tech : Ce nic, désigné par le NicAdmin pour un service, a la possibilité de modifier des données techniques sur le service
- Le Nic Billing : C'est le responsable facturation du service.  

Par défaut, un NicAdmin est également Tech et Billing d'un service.


### Contact domain

Ces contacts sont ceux présents dans le whois ou le fichier RDAP.
Nous allons rester sur le cas des (n)gtlds. Les cctlds ayant parfois des particularités que nous n'évoquerons pas ici pour des raisons de simplicité (et que l'api vous cache le plus possible de toute façon).


- Un contact administratif
- Un contact technique
- Un contact propriétaire (ou titulaire)

Attention au contact propriétaire, celui-ci est le responsable au sens juridique de l'utilisation du nom de domaine. C'est également lui qui est en droit de modifier à tout moment le contact administratif ou technique.

::: warning 

Un prestataire d'un client final ne doit jamais se mettre en tant que contact propriétaire.

:::

### Liens entre nic OVH et contacts whois

Il existe un lien fort entre les nic OVH et les contacts whois/RDAP, le nic OVH Admin et le nic OVH Tech sont synchronisés avec les contacts whois admin et tech. Lors d'une modification d'information sur le nic OVH Admin, celle-ci est synchronisé avec le contact admin sur l'ensemble des noms de domains.

Seul le contact registrant n'est pas lié à un nic OVH.


## Gestion des Nics admin et tech

### Création d'un nouveau nic

### Règles

apis /newAccount

### Modification d'un nic

api /newAccount/rules


## Gestion du contact propriétaire

Un contact propriétaire est représenté à la fois par les routes /me/contact et /domain/contacts.
Historiquement, toutes les actions étaient faisable via /me/contact. Certaines restrictions lié uniquement au métier du nom de domaine nous as contraint de déployer une nouvelle api spécifique. Cependant les apis /domain/contacts représente un "superset" aux apis /me/contact. 
Un contact peut à la fois être récupéer via son id avec l'api GET /me/contact/$id ou l'api /domain/contacts.

Cependant, pour une utilisation de contact dans un contexte de noms de domaine, nous vous conseillons vivement l'utilisation des apis /domain/contacts

Les apis /domain/contacts apportent deux principales fonctionnalités

- L'ajout de champs supplémentaire nécessaire à l'obtention de certaines extensions
- Manipulation de "modèles" : Elle permet d'éviter de créer plusieurs fois le même contact favorisant sa réutilisation


### Récupération des contacts existants


`GET /domains/contacts`


### Création d'un contact

L'api /domains/contacts ne permet que de créer des contacts modèles. 

Une des premières fonctionnalités ajoutés par rapport aux apis /me/contact et la création de contact dit "modèle" ou "template".
Avec l'api suivante, vous créé un modèle
Plutôt que de création de contact, nous devrions parler de contact modèle. En effet l'api suivante créer un modèle de contact. 

api POST /domains/contact

### Modification d'un contact

api PUT /domains/contact


