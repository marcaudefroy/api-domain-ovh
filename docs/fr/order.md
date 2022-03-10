# Commander un nom de domaine

## L'API de commande

Afin de commander vos noms de domaine, voici une présentation des différents objets que vous allez devoir manipuler au travers de l'API.

### Le _panier_

L'objet _cart_ de l'API représente ce panier. Différentes actions sont disponibles :

- Le créer : peut être fait sans être authentifié
- L'assigner à un nic : indispensable pour valider un panier
- Y ajouter des produits
- Demander un aperçu
- Demander une validation en "dry-run" (sans générer de bon de commande)
- Générer un bon de commande

Les APIs concernées commencent par `/order/cart/`

### Les _produits_

Un _item_ représente un produit qui peut être ajouté dans un panier.
Il est possible de :

- récupérer la disponibilité du produit
- ajouter/modifier/supprimer un produit dans le panier
- récupérer les configurations requises afin de valider le panier
- ajouter/supprimer une configuration associée au produit.

Ces APIs commencent par `/order/cart/{cartID}/item/`

### Workflow

Globalement, la commande d'un produit OVHcloud via l'API se fera toujours à travers ces étapes :

1. Créer un panier
1. Récupérer les offres disponibles pour le produit souhaité
1. Mettre le produit dans le panier
1. Visualiser un résumé de son panier (optionnel)
1. Récupérer les configurations requises pour ce produit
1. Ajouter les configurations requises
1. Vérifier son panier via une validation "dry-run" (optionnel)
1. Valider son panier

## Création du panier

La première étape de commande d'un nom de domaine est la création du panier avec l'API suivante :

```text
POST /order/cart
```

| Paramètre     | Requis | Défaut              | Description                         |
| ------------- | ------ | ------------------- | ----------------------------------- |
| ovhSubsidiary | oui    |                     | Filiale OVHcloud                    |
| description   | non    | ""                  | Description personnalisée du panier |
| expire        | non    | maintenant + 1 jour | Expiration du panier                |

:::: tabs

::: tab Go

```go
type Cart struct {
	CartID      string  `json:"cartId"`
	Description string  `json:"description"`
	Expire      string  `json:"expire"`
	Items       []int64 `json:"items"`
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
client
  .requestPromised("POST", "/order/cart")
  .then(function(cart) {
    // panier
  })
  .catch(function(err) {
    // retourne un objet erreur
  });
```

:::

::::

::: details Réponse

```json
{
  "cartId": "c87b5e9d-f586-4456-9f56-1709f40e7b1d",
  "description": "",
  "expire": "2020-10-18T13:44:30+00:00",
  "readOnly": false,
  "items": []
}
```

:::

Gardez la propriété `cartId` de côté, elle nous servira tout au long des étapes suivantes.

## Récupération des offres disponibles

La seconde étape consiste à récupérer les offres accessibles pour un domaine.

```text
GET /order/cart/{cartID}/domain
```

| Paramètre | Requis | Défaut | Description                |
| --------- | ------ | ------ | -------------------------- |
| domain    | oui    | ""     | le nom de domaine souhaité |

:::: tabs

::: tab Go

```go
var offers []ProductInformation
err := client.Get(fmt.Sprintf("/order/cart/%s/domain?domain=foo.fr", cartID), &offers)
```

:::

::: tab Python

```python
offers = client.get("/order/cart/{0}/domain".format(cart.get("cartId")), domain="foo.fr")
```

:::
::: tab JavaScript

```javascript
client
  .requestPromised("GET", "/order/cart/$cartID/domain", {
    domain: "foo.fr"
  })
  .then(function(offers) {
    // Offers
  })
  .catch(function(err) {
    // Return an error object
  });
```

:::

::::

::: details Réponse

```json{3,7,19,64}
[
  {
    "action": "create", // 1.
    "configurations": [],
    "deliveryTime": "",
    "duration": [
      "P1Y", // 2.
      "P2Y",
      "P3Y",
      "P4Y",
      "P5Y",
      "P6Y",
      "P7Y",
      "P8Y",
      "P9Y",
      "P10Y"
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

Il y a 4 valeurs à retenir ici :

1. L'_action_ : celle réalisable sur le domaine, ça peut être un "transfert" ou un "create"
2. La _duration_ : ce champ représente l'unité de période sur laquelle il est possible de commander le domaine. Pour un domaine, P1Y (period 1 year) équivaut à une période d'un an, P2Y une période de deux ans, etc...
3. L'_offerId_ : c'est le nom de l'offre qu'il faudra mettre lors de l'ajout du domaine dans le panier
4. Le _pricing-mode_ : c'est le détail de l'offre qu'il faudra également mettre lors de l'ajout du domaine dans le panier

Il y a deux moyens de déterminer le statut du domaine en fonction du retour de l'API.

Le premier consiste à avoir un mapping entre le pricing-mode et le statut du domaine. Voici ci-dessous la table de mapping exhaustive.

| Pricing-mode                                 | Description                                                                                                                                                |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| create-default                               | Le domaine est libre et au prix standard                                                                                                                   |
| create-premium                               | Le domaine est libre mais est un premium. Son prix est variable d'un domaine à l'autre                                                                     |
| transfer-default                             | Le domaine n'est pas libre mais est transférable si vous en êtes le propriétaire. Son transfert est au prix standard                                       |
| transfer-premium                             | Le domaine n'est pas libre mais est transférable si vous en êtes le propriétaire. C'est un domaine premium et son prix est variable d'un domaine à l'autre |
| transfer-aftermarket1, transfer-aftermarket2 | Le domaine est libre via un marché secondaire. Son prix est variable d'un domaine à l'autre                                                                |

Le deuxième, **déprécié et bientôt supprimé** consiste à analyser le couple pricing-mode/offerId.

| Pricing-mode               | offerId                                          | Description                                                                                                                                                |
| -------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| default                    | \$extension-create (fr-create, com-create)       | Le domaine est libre et au prix standard                                                                                                                   |
| premium                    | \$extension-create (fr-create, com-create)       | Le domaine est libre mais est un premium. Son prix est variable d'un domaine à l'autre                                                                     |
| default                    | \$extension-transfer (fr-transfer, com-transfer) | Le domaine n'est pas libre mais est transférable si vous en êtes le propriétaire. Son transfer est au prix standard                                        |
| premium                    | \$extension-transfer (fr-transfer, com-transfer) | Le domaine n'est pas libre mais est transférable si vous en êtes le propriétaire. C'est un domaine premium et son prix est variable d'un domaine à l'autre |
| aftermarket1, aftermarket2 | \$extension-transfer (fr-transfer, com-transfer) | Le domaine est libre via un marché secondaire. Son prix est variable d'un domaine à l'autre                                                                |

::: tip INFO
Pour le moment, bien que le retour soit un tableau, seulement une offre à la fois est disponible. Dans le futur, il est possible que d'autres offres soient disponibles pour un même domaine. Un domaine pourrait être à la fois transférable depuis un autre registrar ou bien disponible via un marché secondaire.
:::

## Ajout d'un domaine dans le panier

Tandis que la deuxième étape est optionnelle, celle-ci est obligatoire pour la commande d'un nom de domaine.
L'appel suivant permet en effet d'ajouter le domaine désiré dans le panier

```text
POST /order/cart/{cartID}/domain
```

| Paramètre   | Requis | Défaut | Description                                                                                                                                      |
| ----------- | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| domain      | oui    |        | Le nom de domaine souhaité                                                                                                                       |
| duration    | non    |        | Période de réservation. Les valeurs supérieures à P1Y peuvent être acceptées sur certaines extensions, mais ne peuvent en aucun cas excéder P10Y |
| offerId     | non    |        | Offre disponible pour le domaine. Une seule valeur est possible pour un domaine donné, voir ci-dessus pour la récupérer (déprécié)               |
| quantity    | non    |        | Pour le moment, seule la valeur "1" est autorisée                                                                                                |
| planCode    | non    |        | Représente le plan lié au domaine                                                                                                                |
| pricingMode | non    |        | Représente l'offre liée au plan du domaine                                                                                                       |

:::: tabs

::: tab Go

```go
type ItemData struct {
	Domain   string `json:"domain"`
	OfferId  string `json:"offerid"`
	Quantity int64  `json:"quantity"`
	Duration string `json:"duration"`
}

var item Item

data  := ItemData{
  Domain: "foo.fr",

  // optionnel
  PlanCode:    "fr",
  PricingMode: "default-create"
  Quantity:    1,
  Duration:    "P1Y",

  // déprécié
  OfferId: "fr-create",
}
err := client.Post("/order/cart", data, &item)
```

:::

::: tab Python

```python
itemData = {
  "domain" : "foo.fr"

  # optionnel
  "planCode":    "fr",
  "pricingMode": "default-create",
  "quantity":    1,
  "duration":    "P1Y",

  # déprécié
  "offerId": "fr-create",
}

item = client.post("/order/cart/{0}/domain".format(cart.get("cartId")), **itemData)
```

:::
::: tab JavaScript

```javascript
client
  .requestPromised("POST", "/order/cart/$cartID/domain", {
    domain: "foo.fr",
    // optionnel

    planCode: "fr",
    pricingMode: "default-create",
    quantity: 1,
    duration: "P1Y",

    // déprécié
    offerId: "fr-create"
  })
  .then(function(item) {
    // item
  })
  .catch(function(err) {
    // retourne un objet {error: statusCode, message: message}
  });
```

:::

::::

::: details Réponse

```json{7}
{
  "cartId": "c87b5e9d-f586-4456-9f56-1709f40e7b1d",
  "configurations": [68544099],
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

Met la valeur `itemId` de côté, tu en auras besoin pour la suite.

## Résumé du panier

Cette étape est optionnelle. Elle donne un aperçu du contenu du panier, mais elle ne valide pas sa cohérence ou les configurations qu'il contient.

```text
GET /order/cart/{cartID}/summary
```

:::: tabs

::: tab Go

```go
var summary Summary
err := client.Get(fmt.Sprintf("/order/cart/%s/summary", cartID), &summary)
```

:::

::: tab Python

```python
summary = client.get("/order/cart/{0}/summary".format(cart.get("cartId")))
```

:::
::: tab JavaScript

```javascript
client
  .requestPromised("GET", "/order/cart/$cartID/summary")
  .then(function(summary) {
    // résumé
  })
  .catch(function(err) {
    // retourne un objet erreur
  });
```

:::

::::

::: details Réponse

```json
{
  "contracts": [],
  "details": [
    {
      "cartItemID": null,
      "description": "testdomainorder.com - Zone DNS",
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
      "description": "testdomainorder.com - .com demande d'enregistrement - 12 mois",
      "detailType": "DURATION",
      "domain": "*001",
      "originalTotalPrice": {
        "currencyCode": "EUR",
        "text": "9.99 €",
        "value": 9.99
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
        "text": "9.99 €",
        "value": 9.99
      },
      "unitPrice": {
        "currencyCode": "EUR",
        "text": "9.99 €",
        "value": 9.99
      }
    },
    {
      "cartItemID": null,
      "description": "Domain .com",
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
      "description": ".COM Create Prix barre",
      "detailType": "GIFT",
      "domain": "*001",
      "originalTotalPrice": {
        "currencyCode": "EUR",
        "text": "-2.50 €",
        "value": -2.5
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
        "text": "-2.50 €",
        "value": -2.5
      },
      "unitPrice": {
        "currencyCode": "EUR",
        "text": "-2.50 €",
        "value": -2.5
      }
    }
  ],
  "orderId": null,
  "prices": {
    "originalWithoutTax": {
      "currencyCode": "EUR",
      "text": "7.49 €",
      "value": 7.49
    },
    "reduction": {
      "currencyCode": "EUR",
      "text": "0.00 €",
      "value": 0
    },
    "tax": {
      "currencyCode": "EUR",
      "text": "1.50 €",
      "value": 1.5
    },
    "withTax": {
      "currencyCode": "EUR",
      "text": "8.99 €",
      "value": 8.99
    },
    "withoutTax": {
      "currencyCode": "EUR",
      "text": "7.49 €",
      "value": 7.49
    }
  },
  "url": null
}
```

:::

Sans rentrer dans les détails de ce payload, il y a certaines choses à retenir :

- L'ajout d'un item dans le panier produit deux lignes de details sur le bon de commande
- Une ligne de detail est ajoutée par promotion (`detailType` = `GIFT`)
- L'objet `prices` représente le total du panier avec et sans taxe.
- La liste des contrats est vide lors du résumé. Elle sera remplie lors de la validation ou de la création du bon de commande.

::: tip Un petit point sur la zone DNS

La présence d'une zone DNS (représentée par deux lignes de détails) alors qu'elle n'a pas été ajoutée au panier peut surprendre. Cela fait écho à une notion souvent méconnue, ou tout du moins, mal comprise. Une zone DNS et un domaine sont deux choses (produits) différentes. Un nom de domaine peut très bien être chez OVHcloud alors que la zone peut être hébergée autre part.

Cependant, les deux étant très liés et dans le but de faciliter la commande d'un nom de domaine, nous avons fait le choix d'installer automatiquement une zone à l'achat d'un nom de domaine. Bien sûr, il est possible de commander soi-même une zone associée au domaine afin d'y ajouter des options telles que DNSSEC ou DNS Anycast. Mais nous reparlerons de ceci lorsque nous aborderons les options.

:::

## Assigner le panier

Bien que cette opération puisse se faire dès la création du panier, elle devient indispensable à partir de maintenant. Nous le verrons par la suite, les configurations d'un nom de domaine et leur validation dépendent du nic OVHcloud.

```text
POST /order/cart/{cartId}/assign
```

## Gestion des configurations

A ce stade, le panier contient un domaine. Il faut maintenant gérer les configurations requises afin de pouvoir, par la suite, valider le bon de commande.

### Récupération des configurations requises

Pour connaître les configurations requises, il suffit d'appeler l'API suivante.

```text
GET /order/cart/{cartId}/item/{itemId}/requiredConfiguration
```

| Paramètre | Requis | Défaut | Description                                   |
| --------- | ------ | ------ | --------------------------------------------- |
| cartId    | oui    | ""     | L'identifiant du panier                       |
| itemId    | oui    | ""     | L'identifiant de l'item inséré dans le panier |

:::: tabs

::: tab Go

```go
type RequiredConfiguration struct {
	Label         string   `json:"label"`
	Required      bool     `json:"required"`
	Fields        []string `json:"fields,omitempty"`
	AllowedValues []string `json:"allowedValues,omitempty"`
}
var requiredConfigurations []RequiredConfiguration
err := client.Get(fmt.Sprintf("/order/cart/%s/item/%s/requiredConfiguration", cartID, itemID), &requiredConfigurations)
```

:::

::: tab Python

```python
requiredConfigurations = client.get("/order/cart/{0}/item/{1}/requiredConfiguration".format(cartId, itemId))
```

:::
::: tab JavaScript

```javascript
client
  .requestPromised(
    "GET",
    "/order/cart/$cartID/item/$itemID/requiredConfiguration"
  )
  .then(function(requiredConfigurations) {
    // offres
  })
  .catch(function(err) {
    // retourne un objet erreur
  });
```

:::
::::

::: details Réponse

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

La réponse ci-dessus représente l'exemple le plus commun que tu pourras retrouver lors de la commande de création d'un nom de domaine.
Mais celle-ci dépend fortement de l'action désirée (transfert, création), de l'extension ou bien du type de domaine (premium, issu d'un marché secondaire)

Voici la liste exhaustive des différentes configurations requises pour un nom de domaine

| Label             | Type                           | Requis            | Description                                                                                                                                                                                                                                                                                                |
| ----------------- | ------------------------------ | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ADMIN_ACCOUNT     | string                         | non               | Représente le nic OVHcloud qui pourra administrer le domaine et sera associé en tant qu'admin sur le Whois. Si vide, le nic connecté à l'API sera pris par défaut. La valeur attendue doit être un nic valide sous la forme xxx-ovh                                                                        |
| TECH_ACCOUNT      | string                         | non               | Représente le nic OVHcloud qui pourra gérer techniquement le domaine et sera associé en tant que tech sur le Whois. Si vide, le nic connecté à l'API sera pris par défaut. La valeur attendue doit être un nic valide sous la forme xxx-ovh                                                                |
| OWNER_CONTACT     | /me/contact ou /domain/contact | non               | Représente le propriétaire du nom de domaine. Si vide, le nic admin sera pris en modèle pour créer un contact. La valeur attendue est une chaîne de caractères sous la forme /me/contact/1234 ou /domain/contact/12345                                                                                     |
| DOMAIN_CONFIG     | json                           | selon l'extension | Très rarement présent, il est lié à certaines contraintes d'extensions spécifiques (gov.uk par exemple)                                                                                                                                                                                                    |
| ACCEPT_CONDITIONS | bool                           | oui si présent    | Indique que l'extension possède des conditions particulières à l'obtention de l'extension                                                                                                                                                                                                                  |
| REASON            | string                         | oui si présent    | Il indique que le registre demande la raison pour laquelle le domaine veut être commandé. Cela concerne généralement des domaines réservés à des usages spécifiques (ville par exemple)                                                                                                                    |
| CLAIMS_NOTICE     | string                         | oui si présent    | Indique si un avis de marque est présent sur le domaine. Si oui, alors le domaine est protégé par une marque et une notification sera alors envoyée au détenteur de la marque. Si le registrant n'est pas détenteur de la marque, le domaine pourra être supprimé par la suite sans remboursement possible |
| PROTECTED_CODE    | string                         | oui si présent    | Certains domaines sont réservés par un registre et nécessitent un code spécifique pour débloquer leur obtention                                                                                                                                                                                            |
| OWNER_LEGAL_AGE   | bool                           | oui               | Toujours présent, il s'agit d'une configuration de type opt-in afin de certifier que le registrant à l'âge légal pour posséder un nom de domaine                                                                                                                                                           |

::: danger Règles avancées lié aux contacts et aux noms de domaines

Attention, cette API est conçue pour répondre aux besoins de la plupart des produits OVHcloud. Cependant, les noms de domaine ont la particularité d'avoir des règles beaucoup plus complexes concernant la valeur de certaines configuration. Notamment sur les configurations ADMIN_ACCOUNT, OWNER_CONTACT ou encore DOMAIN_CONFIG, celles-ci étant liées à des règles de gestion de la part des registres.

Par exemple, pour l'obtention d'un .berlin, soit le contact registrant soit le contact admin doit résider à Berlin. Or cette API est en incapacité de décrire ce genre de règle.

Pour cela, il existe d'autres API afin de décrire les informations nécessaire à un nom de domaine de manière précise. Ces APIs étant un peu complexe et utilisé également en dehors de la commande (comme pour la mise à jour d'un contact), elles ont le droit à leur propre section : [Gestion des règles](rules).
:::

::: warning Spécificité de la configuration OWNER_CONTACT

Ici, le OWNER_CONTACT représente une API de "ressource", à savoir /me/contact ou plus précisement /domain/contact. Les APIs permettant de créer ces contacts sont décrites dans la section [Gestion des contacts](contacts).

:::

### CRUD des configurations sur le produit

Maintenant qu'on a récupéré la liste des configurations requises, il suffit de les ajouter sur le produit.

#### Ajout d'une configuration

```text
POST /order/cart/{cartId}/item/{itemId}/configuration
```

| Paramètre | Requis | Défaut | Description                                   |
| --------- | ------ | ------ | --------------------------------------------- |
| cartId    | oui    | ""     | L'identifiant du panier                       |
| itemId    | oui    | ""     | L'identifiant de l'item inséré dans le panier |

:::: tabs

::: tab Go

```go
type Configuration struct {
	ID    int64  `json:"id"`
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
err := client.Post(fmt.Sprintf("/order/cart/%s/item/%s/configuration", cartID, itemID), data, &configuration)
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
client
  .requestPromised("POST", "/order/cart/$cartID/item/$itemID/configuration", {
    label: "OWNER_CONTACT",
    value: "/me/contact/1234"
  })
  .then(function(item) {
    // item
  })
  .catch(function(err) {
    // retourne un objet erreur {error: statusCode, message: message}
  });
```

:::

::::

::: details Réponse

```json
{
  "id": 69663774,
  "label": "OWNER_CONTACT",
  "value": "/me/contact/13189481"
}
```

:::

#### Récupération des configurations sur un produit

```text
GET /order/cart/{cartId}/item/{itemId}/configuration
```

#### Récupération de la valeur d'une configuration

```text
GET /order/cart/{cartId}/item/{itemId}/configuration/{configurationId}
```

#### Suppression d'une configuration

```text
DELETE /order/cart/{cartId}/item/{itemId}/configuration/{configurationId}
```

## Gestion du panier

A tout moment, il est bien entendu possible de visualiser et manipuler le panier avec les API suivantes.

#### Récupération des items

```text
GET /order/cart/{cartId}
```

#### Récupération du détail d'un item

```text
GET /order/cart/{cartId}/item/{itemId}
```

#### Suppression d'un item

```text
DELETE /order/cart/{cartId}/item/{itemId}
```

## Validation du panier

Cette étape est sans doute la plus importante du processus de commande et se fait via le call suivant.

```text
GET /order/cart/{cartId}/checkout
```

Elle permet de récupérer le bon de commande dans sa forme finale sans le générer (c'est un "dry-run"). L'objet retourné contient les contrats associés aux différents produits.

Cet appel permet également de valider les configurations comme par exemple les éligibilités du propriétaire pour un nom de domaine.

## Création du bon de commande

```text
POST /order/cart/{cartId}/checkout
```

| Paramètre                         | Requis | Défaut | Description                                                                                    |
| --------------------------------- | ------ | ------ | ---------------------------------------------------------------------------------------------- |
| autoPayWithPreferredPaymentMethod | oui    | ""     | Permet de payer automatiquement le bon de commande avec le moyen de paiement par défaut du nic |
| waiveRetractationPeriod           | oui    | ""     | Requis pour un nom de domaine. Il représente la renonciation au droit de rétractation          |

## Paiement du bon de commande

Si vous n'avez pas payé le bon de commande automatiquement lors de la précédente étape, vous aurez besoin de manipuler les APIs de gestion des bons de commande. Bien qu'il existe de nombreuses APIs en relation avec les moyens de paiement et la gestion des bons de commande, nous partirons du principe qu'au moins un moyen de paiement est enregistré sur votre compte.

### Récupération des moyens de paiement disponible

Dans un premier temps, récupérons les moyens de paiement disponibles pour le bon de commande effectué plus tôt avec la [route suivante](https://api.ovh.com/console/#/me/order/%7BorderId%7D/availableRegisteredPaymentMean#GET).

```text
GET /me/order/{orderId}/availableRegisteredPaymentMean
```

| Paramètre | Requis | Défaut | Description                                                                                                          |
| --------- | ------ | ------ | -------------------------------------------------------------------------------------------------------------------- |
| orderId   | oui    | ""     | OrderId représente l'identifiant du BC obtenu lors de la [creation du bon de commande](#creation-du-bon-de-commande) |

:::: tabs

::: tab Go

```go
type RegisteredPaymentMean struct {
   PaymentMean string `json:"paymentMean"`
}
/* Valeurs possibles pour PaymentMean :
  "CREDIT_CARD"
  "CURRENT_ACCOUNT"
  "DEFERRED_PAYMENT_ACCOUNT"
  "ENTERPRISE"
  "INTERNAL_TRUSTED_ACCOUNT"
  "PAYPAL"
  "bankAccount"
  "creditCard"
  "deferredPaymentAccount"
  "fidelityAccount"
  "ovhAccount"
  "paypal"
*/


var result []RegisteredPaymentMean

err := client.Get(fmt.Sprintf("/me/order/%s/availableRegisteredPaymentMean", orderID), &result)
```

:::

::: tab Python

```python
item = client.get("/me/order/{0}/availableRegisteredPaymentMean".format(orderId), **itemData)
```

:::
::: tab JavaScript

```javascript
client
  .requestPromised("GET", "/me/order/$orderId/availableRegisteredPaymentMean")
  .then(function(result) {
    // résultat
  })
  .catch(function(err) {
    // retourne un objet erreur {error: statusCode, message: message}
  });
```

:::

::::

::: details Réponse

```json
[
  {
    "paymentMean": "bankAccount"
  }
]
```

:::

### Paiement du bon de commande

Le paiement du bon de commande se fait via l'[API ci-dessous](https://api.ovh.com/console/#/me/order/{orderId}/payWithRegisteredPaymentMean#POST). Celle-ci ne retourne aucun résultat mais le statut 200 indique une réussite.

```text
POST /me/order/{orderId}/payWithRegisteredPaymentMean
```

| Paramètre     | Requis                  | Défaut | Description                                                                                                                             |
| ------------- | ----------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| orderId       | oui                     | ""     | OrderId représente l'identifiant du BC obtenu lors de la [creation du bon de commande](#creation-du-bon-de-commande)                    |
| paymentMean   | oui                     | ""     | Moyen de paiement récupéré lors de la [récupération des moyens de paiement disponible](#recuperation-des-moyens-de-paiement-disponible) |
| paymentMeanId | selon moyen de paiement | ""     | L'identifiant du moyen de paiment est obligatoire poour les valeurs `bankAccount`, `creditCard` ou `paypal`                             |

:::: tabs

::: tab Go

```go
data := map[string]string {
  "paymentMean": "fidelityAccount",
}

err := client.Post(fmt.Sprintf("/me/order/%s/payWithRegisteredPaymentMean", orderID), data, nil)
```

:::

::: tab Python

```python
import ovh

client = ovh.Client()

itemData = {
  "paymentMean": "fidelityAccount"
}

result = client.post("/me/order/{0}/payWithRegisteredPaymentMean".format(orderId), **itemData)

```

:::
::: tab JavaScript

```javascript
client
  .requestPromised("POST", "/order/cart", {
    paymentMean: "fidelityAccount"
  })
  .then.then(function() {})
  .catch(function(err) {
    // retourne un objet erreur
  });
```

:::

::::

::: details Réponse

```json
// null
```

:::

## Suivi du bon de commande

L'[API suivante](https://api.ovh.com/console/#/me/order/{orderId}/status#GET) permet de connaître l'état d'un bon de commande.

```text
GET /me/order/{orderId}/status
```

| Paramètre | Requis | Défaut | Description                                                                                                          |
| --------- | ------ | ------ | -------------------------------------------------------------------------------------------------------------------- |
| orderId   | oui    | ""     | OrderId représente l'identifiant du BC obtenu lors de la [creation du bon de commande](#creation-du-bon-de-commande) |

:::: tabs

::: tab Go

```go
type orderStatus string
/* Valeurs possibles pour orderStatus :
    "cancelled"
    "cancelling"
    "checking"
    "delivered"
    "delivering"
    "documentsRequested"
    "notPaid"
    "unknown"
*/
var result orderStatus

err := client.Get(fmt.Sprintf("/me/order/%s/status", orderID), &result)
```

:::

::: tab Python

```python
result = client.get("/me/order/{0}/status".format(orderId))
```

:::
::: tab JavaScript

```javascript
client
  .requestPromised("GET", "/me/order/$orderId/status")
  .then(function(status) {
    // statut
  })
  .catch(function(err) {
    // retourne un objet erreur {error: statusCode, message: message}
  });
```

:::

::::

::: details Réponse

```json
"notPaid"
```

:::
