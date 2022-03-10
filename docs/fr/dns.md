# Gestion des dns

Cette page décrit les informations auprès du registre lié à la résolution du nom de domaine. Cela regroupe :

- Déclaration des serveurs dns
- DNSSEC
- Les glue records

## Type de configuration DNS

La configuration DNS peut être _hosted_ ou _external_.

Le type _hosted_ signifie que la zone DNS est géré de manière automatique par OVH.
Cela vous permet de ne pas avoir à créer vous même votre propre serveur DNS.
Vous avez bien sûr la main sur le contenu de cette zone, mais le choix des serveurs sur lesquel est hébergé la zone n'est pas modifiable. En contrepartie, nous nous occupons de la déclaration de ces serveurs auprès du registre ainsi que la gestion du DNSSEC.

//TODO :

- expliquer l'api GET /domain/{serviceName} qui permet de récupérer quel type de server est enregistré sur le domaine
- expliquer l'api PUT /domain/{serviceName} qui permet de modifier le nameServerType avec le workflow suivant :
  - Pour switch de external à hosted, il faut d'abord avoir une zone dns à OVH (commander une zone dns) pour pouvoir faire le PUT
  - POur switch de hosted à external, il faut d'abord fait le PUT puis ensuite déclarer ses dns (expliquer dans la section suivante)

## Déclaration des serveurs DNS

Cette partie explique comment configurer les serveurs DNS auprès du registre pour pouvoir résoudre votre nom de domaine lorsque celui-ci est configurer pour utiliser des dns externe. Il ne faut pas la confondre avec la gestion de la zone DNS en elle même.

// TODO : expliquer les apis :

- GET|POST /domain/{serviceName}/nameServer
- GET|DELETE /domain/{serviceName}/nameServer/{id}
- GET /domain/{serviceName}/nameServer/{id}/status
- POST /domain/{serviceName}/nameServers/update

## Gestion des glue records

// TODO: Expliquer la notion de glue record et à quoi ça sert. Certains registre nécessite la création avant de modifier les dns. D'autres le font automatiquement donc inutile de créer des glue records. etc...

// Expliquer comment gérer les glue record via les api :

- GET /domain/{serviceName}/glueRecord
- POST /domain/{serviceName}/glueRecord
- DELETE /domain/{serviceName}/glueRecord/{host}
- GET /domain/{serviceName}/glueRecord/{host}
- POST /domain/{serviceName}/glueRecord/{host}/update

## DNSSEC

// TODO
// Expliquer la notion de dnssec (rediriger vers le blog OVH pour le fonctionnement)

### Activer dnssec lorsque les nameserver son hosted

// TODO

DELETE /domain/zone/{zoneName}/dnssec
GET /domain/zone/{zoneName}/dnssec
POST /domain/zone/{zoneName}/dnssec

### Activer dnssec lorsque les nameserver son externe

// TODO : Expliquer qu'OVH ne sera là que pour transmettre les dsrecord au registre
GET /domain/{serviceName}/dsRecord
POST /domain/{serviceName}/dsRecord
GET /domain/{serviceName}/dsRecord/{id}

## Commander une zone dns

TODO: (optional) : Expliquer comment commander une zone chez ovh
