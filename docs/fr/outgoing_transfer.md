# Transfert sortant

On parle de transfert sortant (ou outgoing transfer) lorsqu'un client souhaite migrer son nom de domaine vers un autre registrar. Les instructions suivantes décrivent la manière la plus courant de procéder à ce transfert. Cependant, cette procédure peut varier pour quelques ccTLDs comme .lu, .uk, .hk, et certains TLDs .am, .fm, etc...
Dans ce cas, il convient de se référer à la documentation du registre.

### Domaine lock

Un domain lock est une sécurité permettant d'éviter que votre domaine soit la cible de tentatives de transfert vers un autre registrar. 

Cela signifie que si cette option est activée sur votre nom de domaine, ce dernier ne peut être transféré sans avoir été unlocked au préalable.

Vous pouvez vérifier dans quel état se trouve votre nom de domaine en utlisant la route suivante :

 `GET /domain/{serviceName}` 

```json
 {

    transferLockStatus: "locked"
    dnssecSupported: true
    glueRecordMultiIpSupported: true
    lastUpdate: "2021-09-01T12:44:18+02:00"
    owoSupported: true
    parentService: null
    offer: "gold"
    whoisOwner: "16601832"
    glueRecordIpv6Supported: true
    domain: "xxx.ovh"
    nameServerType: "hosted"

}
```
Pour mettre votre nom de domaine dans un état unlocked, utilisez la même route avec une méthode PUT :

`PUT /domain/{serviceName}` en ajoutant le transferLockStatus à 'locked'.

Les actions sur ces routes ne sont pas instantanées, c'est pourquoi en rééxécutant un `GET /domain/{serviceName}`, vous pouvez voir apparâitre un transferLockStatus à 'unlocking' ou 'locking'.


### Authcode

Après avoir unlocked votre domaine, il vous faut un authcode afin de procéder au transfert sortant. Ce code sera à fournir à votre nouveau registrar.

La route suivante vous permet de le récupérer :

`GET /domain/{serviceName}/authinfo`

NB : Pour l'extension .uk, se référer à la documentation dédiée.