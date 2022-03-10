# Transfert sortant

On parle de transfert sortant (ou outgoing transfer) lorsqu'un client souhaite migrer son nom de domaine vers un autre registrar. Les instructions suivantes décrivent la manière la plus courante de procéder à ce transfert. Cependant, cette procédure peut varier pour quelques ccTLDs comme .lu, .uk, .hk, et certains TLDs .am, .fm, etc...
Dans ce cas, il convient de se référer à la documentation du registre.

## Domaine lock

Un domain lock est une sécurité permettant d'éviter que votre domaine soit la cible de tentatives de transfert vers un autre registrar. 

Cela signifie que si cette option est activée sur votre nom de domaine, ce dernier ne peut être transféré sans avoir été unlocked au préalable.

Vous pouvez vérifier dans quel état se trouve votre nom de domaine en utlisant la route suivante :

 [`GET /domain/{serviceName}`](https://api.ovh.com/console/#/domain/%7BserviceName%7D~GET)

```json
 {
    "transferLockStatus": "locked",
    "parentService": null,
    "nameServerType": "hosted",
    "offer": "gold",
    "whoisOwner": "16601832",
    "owoSupported": true,
    "lastUpdate": "2022-03-10T14:00:40+01:00",
    "glueRecordIpv6Supported": true,
    "domain": "xxx.ovh",
    "glueRecordMultiIpSupported": true,
    "dnssecSupported": true
}
```
Pour mettre votre nom de domaine dans un état unlocked, utilisez la même route avec une méthode PUT :

[`PUT /domain/{serviceName}`](https://api.ovh.com/console/#/domain/%7BserviceName%7D~PUT) en ajoutant le transferLockStatus à 'locked'.
Les actions sur ces routes ne sont pas instantanées, c'est pourquoi en rééxécutant un [`GET /domain/{serviceName}`](https://api.ovh.com/console/#/domain/%7BserviceName%7D~GET), vous pouvez voir apparaître un transferLockStatus à 'unlocking' ou 'locking'.


## Authcode

Après avoir unlocked votre domaine, il vous faut un authcode afin de procéder au transfert sortant. Ce code sera à fournir à votre nouveau registrar.

La route suivante vous permet de le récupérer :

[`GET /domain/{serviceName}/authInfo`](https://api.ovh.com/console/#/domain/%7BserviceName%7D/authInfo~GET)

Votre nouveau registrar procédera alors au transfert.

NB : Pour l'extension .uk, se référer à la documentation dédiée.