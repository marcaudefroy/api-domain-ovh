# Gestion des dns

Cette page décrit les informations auprès du registre lié à la résolution du nom de domaine. Cela regroupe :

- Déclaration des serveurs dns
- DNSSEC
- Les glue records


## Type de configuration DNS

La configuration DNS peut être *hosted* ou *external*. 

Le type *hosted* signifie que la zone DNS est géré de manière automatique par OVH.
Cela vous permet de ne pas avoir à créer vous même votre propre serveur DNS.
Vous avez bien sûr la main sur le contenu de cette zone, mais le choix des serveurs sur lesquel est hébergé la zone n'est pas modifiable. En contrepartie, nous nous occupons de la déclaration de ces serveurs auprès du registre ainsi que la gestion du DNSSEC.

## Déclaration des serveurs DNS

Cette partie explique comment configurer les serveurs DNS auprès du registre pour pouvoir résoudre votre nom de domaine. Il ne faut pas la confondre avec la gestion de la zone DNS en elle même. 





## Gestion des glue records

## DNSSEC 