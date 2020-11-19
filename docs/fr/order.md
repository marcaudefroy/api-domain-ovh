# Commander un nom de domaine 

## L'api de commande

Afin de commander vos noms de domaine, voici une présentation des différents objets que tu vas devoir manipuler au travers de l'API.


### Le *panier*

L'objet *cart* de l'api représente ce panier. Différentes actions sont disponible :

- Le créer : Peut être fait sans être authentifié
- L'assigner à un nic : Indispensable pour valider un panier
- Y ajouter des produits
- Demander un aperçu
- Demander une validation en "dry-run" (sans générer de BC)
- Générer un BC

Les apis commencent par /order/cart/


### Les *produits*

Un **item** représente un produit qui peut être ajouter dans un panier.
Il possède 
- une api pour récupérer la disponibilité du produit
- des apis pour ajouter/modifier/supprimer un produit dans le panier
- une api pour récupérer les configurations requises afin de valider le panier
- des apis pour ajouter/supprimer une configuration associé au produit.

Les apis commencent par /order/cart/{cartID}/item/

### Workflow

Globalement, la commande d'un produit OVHcloud via l'api se fera toujours au travers de ces étapes:

1. Créer un panier
1. Récupérer les offres disponible pour le produit souhaité
1. Mettre le produit dans le panier
1. Visualiser un résumé de son panier (optional)
1. Récupérer les configurations requise pour ce produit
1. Ajouter les configurations requises
1. Vérifier son panier via une validation "dry-run" (optional)
1. Valider son panier


## Création du panier

La première étape de commande d'un nom de domaine est la création du panier avec l'api suivante : 

`POST /order/cart`

Parameter | Required | Default | Description
--------- | -------  | ------- | -----------
ovhSubsidiary | true  |             | OVH subsidiary
description   | false | ""          | Description customisé du panier
expire        | false | now + 1 day | Expiration du cart


:::: tabs

::: tab Go

```go
type Cart struct {
  CartID string `json:"cartId"`
  Description string `json:"description"`
  Expire string `json:"expire"`
  Items []int64 `json:"items"`
}
var cart Cart
err := client.Post("/order/cart", &cart)
```
:::

::: tab Python

```python
import ovh

client = ovh.Client()

cart = client.post("/order/cart", ovhSubsidiary="FR", description="", _need_auth=False)
```

::: 
::: tab JavaScript


```javascript

client.requestPromised('POST', '/order/cart')
  .then(function (cart) {
    // Cart
  })
  .catch(function (err) {
    // Return an error object
  });

```

:::

::::

::: details Response

```json
{

    "cartId": "c87b5e9d-f586-4456-9f56-1709f40e7b1d",
    "description": "",
    "expire": "2020-10-18T13:44:30+00:00",
    "readOnly": false,
    "items": [ ]
}
```

:::

Garder la propriété cartId de côté, elle te servira tout au long des étapes suivantes.

## Récupération des offres disponibles


La seconde étape consiste à récupérer les offres accessible pour un domain.


`GET /order/cart/{cartID}/domain`

Parameter | Required | Default | Description
--------- | -------  | ------- | -----------
domain | true | "" | le nom de domain souhaité

:::: tabs

::: tab Go

```go
var offers []ProductInformation
err := client.Get("/order/cart/$cartID/domain?domain=foo.fr", &offers)
```
:::

::: tab Python

```python
offers = client.get("/order/cart/{0}/domain".format(cart.get("cartId")), domain="foo.fr")
```

::: 
::: tab JavaScript


```javascript
client.requestPromised('GET', '/order/cart/$cartID/domain', {
  'domain': 'foo.fr'
}).then(function (offers) {
  // Offers
})
.catch(function (err) {
  // Return an error object
});
```

:::

::::

::: details Response

```json{3,7,10,55}
[
  {
    "action": "create", // 1.
    "configurations": [],
    "deliveryTime": "",
    "duration": [
      "P1Y" // 2.
    ],
    "offer": "gold",
    "offerId": "fr-create", // 3.
    "orderable": true,
    "phase": "ga",
    "prices": [
      {
        "label": "PRICE",
        "price": {
          "currencyCode": "EUR",
          "text": "6.99 €",
          "value": 6.99
        }
      },
      {
        "label": "RENEW",
        "price": {
          "currencyCode": "EUR",
          "text": "6.99 €",
          "value": 6.99
        }
      },
      {
        "label": "DISCOUNT",
        "price": {
          "currencyCode": "EUR",
          "text": "2.00 €",
          "value": 2
        }
      },
      {
        "label": "FEE",
        "price": {
          "currencyCode": "EUR",
          "text": "0.00 €",
          "value": 0
        }
      },
      {
        "label": "TOTAL",
        "price": {
          "currencyCode": "EUR",
          "text": "4.99 €",
          "value": 4.99
        }
      }
    ],
    "pricingMode": "default", // 4.
    "productId": "domain",
    "quantityMax": 1
  }
]
```

:::

Ici, il y a 4 valeurs à retenir ici :

1. L'*action* : Celle réalisable sur le domain, ça peut être un transfer ou un create
2. La *duration* : Ce champs représente l'unite de période sur laquelle il est possible de commander le domande. Pour un domain, P1Y (period 1 year) équivaut à une période d'un an. Seul cette valeur est autorisé pour un domain.
3. L'*offerId* : C'est le nom de l'offre qu'il faudra mettre lors de l'ajout du domain dans le panier
4. Le *pricing-mode* : C'est le détail de l'offre qu'il faudra également mettre lors de l'ajout du domain dans le panier


::: tip INFO
Pour le moment, bien que le retour soit un tableau, seulement une offre à la fois est disponible. Dans le futur, il est possible que d'autres offres soient disponibles pour un même domaine. Un domain pourrait être à la fois transférable depuis un autre registrar ou bien disponible via un marché secondaire.
:::



## Ajout d'un domain dans le panier

Tandis que la deuxième étape est optionnel, celle-ci est obligatoire pour la commande d'un nom de domaine.
L'appel suivant permet en effet d'ajouter le domain désiré dans le panier



`POST /order/cart/{cartID}/domain`

Parameter | Required | Default | Description
--------- | -------  | ------- | -----------
domain    | true     |         | Le nom de domain souhaité
duration  | false    |         | Période de réservation. Seule la valeur P1Y est accepté
offerId   | false    |         | Offre disponible pour le domaine. Cette valeur ne peut avoir qu'une seule valeur pour un domain donné
quantity  | false    |         | Nombre d'années voulu. Pour le moment, seul la valeur une est autorisée 


:::: tabs

::: tab Go

```go
type ItemData struct {
  Domain string `json:"domain"`
  OfferId string `json:"offerid"`
  Quantity int64 `json:"quantity"`
  Duration string `json:"duration"`
}

var item Item 

data  := ItemData{
  Domain: "foo.fr",

  //optional
  OfferId: "fr-create", 
  Quantity:1, 
  Duration: "P1Y",
}   
err := client.Post("/order/cart", data, &item)
```
:::

::: tab Python

```python
itemData = {
  "domain" : "foo.fr"

  #optional
  "offerId": "fr-create", 
  "quantity":1, 
  "duration": "P1Y",
}

item = client.post("/order/cart/{0}/domain".format(cart.get("cartId")), **itemData)
```

::: 
::: tab JavaScript


```javascript

client.requestPromised('POST', '/order/cart/$cartID/domain', {
      'domain': 'foo.fr',
      // Optional
      'offerId': 'fr-create',
      'quantity' : 1,
      'duration' : 'P1Y'
})
  .then(function (item) {
    // item
  })
  .catch(function (err) {
    //Return an error object like this {error: statusCode, message: message}
  });

```

:::

::::

::: details Response

```json{7}
{
  "cartId": "c87b5e9d-f586-4456-9f56-1709f40e7b1d",
  "configurations": [
    68544099
  ],
  "duration": "P1Y",
  "itemId": 109074889,
  "offerId": null,
  "options": [],
  "prices": [
    {
      "label": "TOTAL",
      "price": {
        "currencyCode": "EUR",
        "text": "6.99 €",
        "value": 6.99
      }
    },
    {
      "label": "FEE",
      "price": {
        "currencyCode": "EUR",
        "text": "6.99 €",
        "value": 6.99
      }
    },
    {
      "label": "RENEW",
      "price": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      }
    },
    {
      "label": "PRICE",
      "price": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      }
    }
  ],
  "productId": "domainblog",
  "settings": {
    "catalogName": "dom-public",
    "domain": "foo.fr",
    "planCode": "fr",
    "pricingMode": "create-default",
    "quantity": 1
  }
}
```

:::

Met la valeur itemId de côté, tu en auras besoin pour la suite.



## Résumé du panier

Cette étape te permet d'avoir le résumé de votre panier. Cette étape est optionnel, elle ne valide pas la consistence ou les configurations du panier. Elle te donne seulement un aperçu de ton panier.

`GET /order/cart/{cartID}/summary`

:::: tabs

::: tab Go

```go
var summary
err := client.Get("/order/cart/$cartID/summary", &summary)
```
:::

::: tab Python

```python
summary = client.get("/order/cart/{0}/summary".format(cart.get("cartId")))
```

::: 
::: tab JavaScript


```javascript
client.requestPromised('GET', '/order/cart/$cartID/domain').then(function (summary) {
  // summary
})
.catch(function (err) {
  // Return an error object
});
```


:::

::::


::: details Response

```json
{
  "contracts": [],
  "details": [
    {
      "cartItemID": null,
      "description": "foo.fr - Zone DNS",
      "detailType": "INSTALLATION",
      "domain": "*001.001",
      "originalTotalPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      },
      "quantity": 1,
      "reductionTotalPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      },
      "reductions": [],
      "totalPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      },
      "unitPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      }
    },
    {
      "cartItemID": null,
      "description": "foo.fr - Zone DNS",
      "detailType": "DURATION",
      "domain": "*001.001",
      "originalTotalPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      },
      "quantity": 1,
      "reductionTotalPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      },
      "reductions": [],
      "totalPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      },
      "unitPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      }
    },
    {
      "cartItemID": null,
      "description": "DNS zone",
      "detailType": "INSTALLATION",
      "domain": "*001.001",
      "originalTotalPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      },
      "quantity": 1,
      "reductionTotalPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      },
      "reductions": [],
      "totalPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      },
      "unitPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      }
    },
    {
      "cartItemID": null,
      "description": "foo.fr - .fr demande d'enregistrement - 1 an",
      "detailType": "INSTALLATION",
      "domain": "*001",
      "originalTotalPrice": {
        "currencyCode": "EUR",
        "text": "6.99 €",
        "value": 6.99
      },
      "quantity": 1,
      "reductionTotalPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      },
      "reductions": [],
      "totalPrice": {
        "currencyCode": "EUR",
        "text": "6.99 €",
        "value": 6.99
      },
      "unitPrice": {
        "currencyCode": "EUR",
        "text": "6.99 €",
        "value": 6.99
      }
    },
    {
      "cartItemID": null,
      "description": "foo.fr - .fr demande d'enregistrement - 1 an",
      "detailType": "DURATION",
      "domain": "*001",
      "originalTotalPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      },
      "quantity": 1,
      "reductionTotalPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      },
      "reductions": [],
      "totalPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      },
      "unitPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      }
    },
    {
      "cartItemID": null,
      "description": "Domain .fr",
      "detailType": "INSTALLATION",
      "domain": "*001",
      "originalTotalPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      },
      "quantity": 1,
      "reductionTotalPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      },
      "reductions": [],
      "totalPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      },
      "unitPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      }
    },
    {
      "cartItemID": null,
      "description": ".FR Create Prix barre",
      "detailType": "GIFT",
      "domain": "*001",
      "originalTotalPrice": {
        "currencyCode": "EUR",
        "text": "-2.00 €",
        "value": -2
      },
      "quantity": 1,
      "reductionTotalPrice": {
        "currencyCode": "EUR",
        "text": "0.00 €",
        "value": 0
      },
      "reductions": [],
      "totalPrice": {
        "currencyCode": "EUR",
        "text": "-2.00 €",
        "value": -2
      },
      "unitPrice": {
        "currencyCode": "EUR",
        "text": "-2.00 €",
        "value": -2
      }
    }
  ],
  "orderId": null,
  "prices": {
    "originalWithoutTax": {
      "currencyCode": "EUR",
      "text": "4.99 €",
      "value": 4.99
    },
    "reduction": {
      "currencyCode": "EUR",
      "text": "0.00 €",
      "value": 0
    },
    "tax": {
      "currencyCode": "EUR",
      "text": "1.00 €",
      "value": 1
    },
    "withTax": {
      "currencyCode": "EUR",
      "text": "5.99 €",
      "value": 5.99
    },
    "withoutTax": {
      "currencyCode": "EUR",
      "text": "4.99 €",
      "value": 4.99
    }
  },
  "url": null
}
```

:::

Sans rentrer dans les détails de ce payload, il y a certaines choses à retenir :

- L'ajout d'un item dans le panier produit 3 lignes de details sur le BC
- Une ligne de detail est ajouté par promotion (detailType = GIFT)
- L'objet prices représente le total du panier avec ou sans taxe.
- La liste des contrats est vide lors du résumé. Elle sera remplit lors de la validation ou de la création du bon de commande.


::: tip Un petit point sur la zone DNS 

Une chose qui peut surprendre dans ce résumé est la présence d'une zone DNS (représentée par 3 lignes de détails) alors qu'elle est absente du panier. Cela fait echo à une notion souvent méconnu, ou tout du moins, mal comprise. Une zone DNS et un domaine sont deux choses (produits) différentes. Un nom de domaine peut très bien être chez OVHcloud alors que la zone peut-être hébergé autre part. Cependant, les deux étant très lié et dans un but de faciliter la commande d'un nom de domaine, nous avons fait le choix d'ajouter automatiquement une zone à l'achat d'un nom de domaine. Bien sûr, il est possible d'ajouter toi même une zone dans le panier associé au domaine afin d'y ajouter des options tels que dnssec ou dnsanycast. Mais nous reparlerons de ceci lorsque nous aborderons les options.

:::

## Assigner le panier

Bien que cette opération peut se faire dès la création du cart, elle devient indispensable à partir de maintenant. Nous le verrons par la suite, mais les configurations d'un nom de domaine et sa validation dépend du nic OVH. 

`POST /order/cart/{cartId}/assign`

## Gestion des configurations

A ce stade, le panier contient un domain. Il faut maintenant gérer les configurations requises afin de pouvoir, par la suite, valider le bon de commande. 

### Récupération des configurations requises

Pour connaître ces configurations requises, il suffit d'appeler l'API suivante.

`GET /order/cart/{cartId}/item/{itemId}/requiredConfiguration`

Parameter | Required | Default | Description
--------- | -------  | ------- | -----------
cartId | true | "" | L'id du cart
itemId | true | "" | L'id de l'item inséré dans le cart

:::: tabs

::: tab Go

```go

type RequiredConfiguration struct {
  Label string `json:"label"`
  Required bool `json:"required"`
  Fields []string `json:"fields,omitempty"`
  AllowedValues []string `json:"allowedValues,omitempty"`
}
var requiredConfigurations []RequiredConfiguration
err := client.Get("/order/cart/$cartID/item/$itemID/requiredConfiguration", &requiredConfigurations)
```
:::

::: tab Python

```python
requiredConfigurations = client.get("/order/cart/{0}/item/{1}/requiredConfiguration".format(cartId, itemId))
```

::: 
::: tab JavaScript


```javascript
client.requestPromised('GET', '/order/cart/$cartID/item/$itemID/requiredConfiguration')
.then(function (requiredConfigurations) {
  // Offers
})
.catch(function (err) {
  // Return an error object
});
```

:::
::::


::: details Response

```json
[
  {
    "label": "OWNER_LEGAL_AGE",
    "type": "bool"
  },
  {
    "label": "OWNER_CONTACT",
    "type": "/me/contact"
  },
  {
    "label": "ADMIN_ACCOUNT",
    "type": "Nichandle"
  },
  {
    "label": "TECH_ACCOUNT",
    "type": "Nichandle"
  },
  {
    "label": "DNS",
    "type": "String"
  }
]
```
:::

La réponse ci-dessus représente l'exemple le plus commun que tu pourrras retrouvé lors de la commande de création d'un nom de domaine.
Mais celle-ci dépend fortement de l'action désirée (transfert, creation), de l'extension ou bien du type de domain (premium, issue d'un marché de secondaire)

Voici la liste exhaustive des différentes configurations requises pour un nom de domaine



Label | Type | Obligatoire | Description
--------- | -------  | ------- | ---------
ADMIN_ACCOUNT | string | Non | Représente le nic ovh qui pourra administrer le domaine et sera associé en tant qu'admin sur le whois. Si vide, le nic connecté à l'api sera pris par default. La valeur attendu doit être un nic valide sous la forme xxx-ovh
TECH_ACCOUNT | string | Non | Représente le nic ovh qui pourra gérer techniquement le domaine et sera associé en tant que tech sur le whois. Si vide, le nic connecté à l'api sera pris pas default. La valeur attendu doit être un nic valide sous la forme xxx-ovh
OWNER_CONTACT | /me/contact ou /domain/contact | Non | Représente le propriétaire du nom de domaine. Si vide, le nicadmin sera pris en modèle pour créer un contact. La valeur attendu est une chaine de charactère sous la forme /me/contact/1234 ou /domain/contact/12345
DOMAIN_CONFIG | json | Relatif à l'extension | Très rarement présent, il est lié à certaines contraintes de tld spécifique (gov.uk par exemple).
ACCEPT_CONDITIONS | bool | Oui si présent | Indique que l'extension possède des conditions particulière à l'obtention de l'extension.
REASON | string | Oui si présent | Il indique que le registre demande la raison pour laquelle le domain veut être commandé. Cela concerne généralement des domaines réservés à des usages spécifique (ville par exemple)
CLAIMS_NOTICE | string | Oui si présent | Indique si un avis de marque est présente sur le domaine. Si oui, alors le domain est protégé par une marque et une notification sera alors envoyé au détenteur de la marque. Si le registrant n'est pas détenteur de la marque, le domaine pourra être supprimé par la suite sans remboursement possible.
PROTECTED_CODE | string | Oui si présent | Certains domaines sont réservés par un registre et nécessite un code spécifique pour débloquer son obtention.   
OWNER_LEGAL_AGE | bool | Oui | Toujours présent, il s'agit d'une configuration de type opt-in afin de certifié que le registrant à l'âge légal pour posséder un nom de domaine



::: danger  Règles avancées lié aux contacts et aux noms de domaines

Attention, cette API est designé pour répondre au besoin de la plupart des produits OVH. Cependant, les noms de domaine ont la particularité d'avoir des règles beaucoup plus complexe concernant la valeur de certaines configuration. Notamment sur les configurations ADMIN_ACCOUNT, OWNER_CONTACT ou encore DOMAIN_CONFIG. Celle-ci étant lié à des règles de gestion de la part des registres.

Par exemple, pour l'obtention d'un .berlin, soit le contact registrant soit le contact admin doit résider à berlin. Or cette api est en incapacité de décrire ce genre de règle.

Pour cela, il existe d'autres API afin de décrire les informations nécessaire à un nom de domaine de manière précise. Ces APIs étant un peu complexe et utilisé également en dehors de la commande (comme pour la mise à jour d'un contact), elles ont le droit à leur propre section : [Gestion des règles](rules)
::: 

::: warning  Spécificité de la configuration OWNER_CONTACT

Ici, le OWNER_CONTACT représente une "recourse" API, à savoir /me/contact ou plus précisement /domain/contact. Les apis permettant de créer ces contacts sont décrites dans la section [Gestion des contacts](contacts).

::: 

### CRUD des configurations sur le produit

Maintenant qu'on a récupéré la liste des configurations requises, il suffit de les ajouter sur le produit.

#### Ajout d'une configuration

`POST /order/cart/{cartId}/item/{itemId}/configuration`

Parameter | Required | Default | Description
--------- | -------  | ------- | -----------
cartId | true | "" | L'id du cart
itemId | true | "" | L'id de l'item inséré dans le cart

:::: tabs

::: tab Go

```go

type Configuration struct {
  ID int64 `json:"id"`
  Label string `json:"label"`
  Value string `json:"value"`
}

type ConfigurationPayload struct {
  Label string `json:"label"`
   Value string `json:"value"`
}

var configuration Configuration

var data := ConfigurationPayload{
  Label: "OWNER_CONTACT",
  Value: "/me/contact/1234"
}
err := client.Post("/order/cart/$cartID/item/$itemID/configuration", ,&configuration)
```
:::

::: tab Python

```python
itemData = {
  "label" : "OWNER_CONTACT",
  "value": "/me/contact/1234"
}

item = client.post("/order/cart/{0}/item/{1}/configuration".format(cart.get("cartId"), itemID), **itemData)
```

::: 
::: tab JavaScript


```javascript

client.requestPromised('POST', '/order/cart/$cartID/item/$itemID/configuration', {
      'label': 'OWNER_CONTACT',
      'value': '/me/contact/1234'
})
  .then(function (item) {
    // item
  })
  .catch(function (err) {
    //Return an error object like this {error: statusCode, message: message}
  });

```

:::

::::


::: details Response

```json
{
  "id": 69663774,
  "label": "OWNER_CONTACT",
  "value": "/me/contact/13189481"
}
```
:::

#### Récupération des configurations sur un produit

`GET /order/cart/{cartId}/item/{itemId}/configuration`

#### Récupération de la valeur d'une configuration

`GET /order/cart/{cartId}/item/{itemId}/configuration/{configurationId}`

#### Suppression d'une configuration

`DELETE /order/cart/{cartId}/item/{itemId}/configuration/{configurationId}`



## Gestion des options

TODO

## Gestion du panier

A tout moment, il est bien entendu possible de visualiser et manipuler le panier avec les api suivantes.

#### Récupération des items

`GET /order/cart/{cartId}`

#### Récupération du détail d'un item

`GET /order/cart/{cartId}/item/{itemId}`

#### Suppression d'un item

`DELETE /order/cart/{cartId}/item/{itemId}`


## Validation du panier

Cette étape est sans doute la plus importante du processus de commande et se fait via le call suivant. 

`GET  /order/cart/{cartId}/checkout`

Elle permet de récupérer le bon de commande dans sa forme final sans le générer (c'est un "dry-run"). L'objet retourné contient les contrats associés aux différents produits.

Cet appel permet également de valider les configurations comme par exemple les éligibilités du propriétaire pour un nom de domaine. 

## Création du bon de commande

`POST  /order/cart/{cartId}/checkout`

Parameter | Required | Default | Description
--------- | -------  | ------- | -----------
autoPayWithPreferredPaymentMethod | true | "" | Permet de payer automatiquement le bon de commande avec le moyen de paiement par défaut du nic
waiveRetractationPeriod | true | "" | Requis pour un nom de domaine. Il représente le rejet du droit de rétractation.

## Paiement du bon de commande

Le gestion des bons de commande se font via les apis /me/order/{orderId} et ne seront pas explicité dans cette partie.
