# Gestion des règles d'éligibilité

## Introduction

L'obtention et la détention d'un nom de domaine sont accompagnées d'obligations légales tel que :
- les règles d'utilisation d'un nom de domaine. Un .travel doit nécessairement avoir un lien avec l'industrie du tourisme.
- les règles d'éligibilitées. L'adresse du contact propriétaire d'un .eu doit se situer au sein de l'union européenne.

Ces règles sont fixées par l'opérateur de l'extension, le registre, et varient selon les extensions tout en évoluant au fil du temps.

Concernant les règles d'éligibilité, elles concernent des éléments connues du registrar tel que le domain, les contacts ou encore la procédure d'enregistrement. Ces règles d'éligibilité s'appliquent : 

- Sur les données du **contact propriétaire, administratif et technique**. Par exemple, l'adresse du propriétaire doit se situé au sein de l'union européenne pour un domain .eu.
- Sur des données liées à la **procédure** de demande de création, de transfer, de changement de propriétaire. Par exemple la raison de la création d'un domaine en .fr représentant un nom de ville.

Avec un nombre d'extensions grandissant d'année en année, il devient ingérable de traiter ces différentes règles manuellement. Il devient alors nécessaire d'automatiser la gestion de ces règles. 
En réussissant à définir une description de ces différentes règles dans un format technique, il est possible d'automatiser la génération des différents formulaires requis ainsi que la validation des données saisies.

## Représentation technique

Les conditions d'éligibilités d'un domain peuvent être représenté sous la forme d'un objet json **récursif**. 

Voici l'exemple de la représentation json du .com que l'on peut obtenir via l'api `/domain/configurationRule` (que nous expliciteront plus tard).
Inutile de s'y attarder pour le moment, nous allons décortiquer tout ça pas à pas.

::: details Example

```json
{
  "and": [
    {
      "label": "OWNER_CONTACT",
      "type": "contact",
      "fields": {
        "and": [
          {
            "label": "address.city",
            "type": "string",
            "description": "Represents the city of the owner contact.",
            "placeholder": "lorem",
            "constraints": [
              {
                "operator": "required"
              },
              {
                "operator": "maxlength",
                "value": "255"
              }
            ]
          },
          {
            "label": "address.country",
            "type": "string",
            "description": "Represents the country of the owner contact.",
            "placeholder": "FR",
            "constraints": [
              {
                "operator": "contains",
                "values": [
                  "AC",
                  "AD",
                  "AE",
                  "AF",
                  "AG",
                  "AI",
                  "AL",
                  "AM",
                  "AO",
                  "...",
                  "YT",
                  "ZA",
                  "ZM",
                  "ZW"
                ]
              },
              {
                "operator": "required"
              },
              {
                "operator": "maxlength",
                "value": "255"
              }
            ]
          },
          {
            "label": "email",
            "type": "string",
            "description": "Represents the email of the owner contact.",
            "placeholder": "lorem@ovh.com",
            "constraints": [
              {
                "operator": "required"
              },
              {
                "operator": "maxlength",
                "value": "255"
              }
            ]
          },
          {
            "label": "firstName",
            "type": "string",
            "description": "Represents the firstname of the owner contact.",
            "placeholder": "lorem",
            "constraints": [
              {
                "operator": "required",
                "conditions": {
                  "label": "OWNER_CONTACT",
                  "type": "contact",
                  "fields": {
                    "label": "legalForm",
                    "type": "string",
                    "constraints": [
                      {
                        "operator": "eq",
                        "value": "individual"
                      },
                      {
                        "operator": "required"
                      }
                    ]
                  },
                  "constraints": [
                    {
                      "operator": "required"
                    }
                  ]
                }
              },
              {
                "operator": "maxlength",
                "value": "255"
              }
            ]
          },
          {
            "label": "language",
            "type": "string",
            "description": "Represents the langage of the owner contact.",
            "placeholder": "fr_FR",
            "constraints": [
              {
                "operator": "contains",
                "values": [
                  "fr_FR",
                  "pl_PL",
                  "de_DE",
                  "es_ES",
                  "en_GB",
                  "it_IT",
                  "pt_PT",
                  "nl_NL",
                  "cs_CZ",
                  "en_IE",
                  "lt_LT",
                  "fi_FI",
                  "fr_SN",
                  "fr_TN",
                  "fr_MA",
                  "en_AU",
                  "en_CA",
                  "fr_CA",
                  "en_US",
                  "es_ES"
                ]
              },
              {
                "operator": "required"
              },
              {
                "operator": "maxlength",
                "value": "255"
              }
            ]
          },
          {
            "label": "lastName",
            "type": "string",
            "description": "Represents the lastname of the owner contact.",
            "placeholder": "lorem",
            "constraints": [
              {
                "operator": "required",
                "conditions": {
                  "label": "OWNER_CONTACT",
                  "type": "contact",
                  "fields": {
                    "label": "legalForm",
                    "type": "string",
                    "constraints": [
                      {
                        "operator": "eq",
                        "value": "individual"
                      },
                      {
                        "operator": "required"
                      }
                    ]
                  },
                  "constraints": [
                    {
                      "operator": "required"
                    }
                  ]
                }
              },
              {
                "operator": "maxlength",
                "value": "255"
              }
            ]
          },
          {
            "label": "legalForm",
            "type": "string",
            "description": "Represents the legal status of owner.",
            "placeholder": "individual",
            "constraints": [
              {
                "operator": "contains",
                "values": [
                  "association",
                  "corporation",
                  "individual",
                  "other"
                ]
              },
              {
                "operator": "required"
              },
              {
                "operator": "maxlength",
                "value": "255"
              }
            ]
          },
          {
            "label": "address.line1",
            "type": "string",
            "description": "Represents the address of the owner contact.",
            "placeholder": "lorem",
            "constraints": [
              {
                "operator": "required"
              },
              {
                "operator": "maxlength",
                "value": "255"
              }
            ]
          },
          {
            "label": "organisationName",
            "type": "string",
            "description": "Represents the organisation of the owner contact",
            "placeholder": "lorem",
            "constraints": [
              {
                "operator": "required",
                "conditions": {
                  "label": "OWNER_CONTACT",
                  "type": "contact",
                  "fields": {
                    "label": "legalForm",
                    "type": "string",
                    "constraints": [
                      {
                        "operator": "ne",
                        "value": "individual"
                      },
                      {
                        "operator": "required"
                      }
                    ]
                  },
                  "constraints": [
                    {
                      "operator": "required"
                    }
                  ]
                }
              },
              {
                "operator": "maxlength",
                "value": "255"
              }
            ]
          },
          {
            "label": "phone",
            "type": "string",
            "description": "Represents the phone of the owner contact.",
            "placeholder": "+33.612345678",
            "constraints": [
              {
                "operator": "required"
              },
              {
                "operator": "maxlength",
                "value": "255"
              }
            ]
          },
          {
            "label": "address.zip",
            "type": "string",
            "description": "Represents the zip of the owner contact.",
            "placeholder": "12345",
            "constraints": [
              {
                "operator": "required",
                "conditions": {
                  "label": "OWNER_CONTACT",
                  "type": "contact",
                  "fields": {
                    "label": "address.country",
                    "type": "string",
                    "constraints": [
                      {
                        "operator": "notcontains",
                        "values": [
                          "IE",
                          "AZ",
                          "DJ",
                          "LA",
                          "CI",
                          "AN",
                          "HK",
                          "BO",
                          "PA",
                          "HN",
                          "NI",
                          "SV",
                          "CO"
                        ]
                      },
                      {
                        "operator": "required"
                      }
                    ]
                  },
                  "constraints": [
                    {
                      "operator": "required"
                    }
                  ]
                }
              },
              {
                "operator": "maxlength",
                "value": "255"
              }
            ]
          }
        ],
        "constraints": []
      },
      "description": "rule related to the owner domain",
      "constraints": [
        {
          "operator": "required"
        }
      ]
    },
    {
      "label": "OWNER_LEGAL_AGE",
      "type": "bool",
      "description": "The owner must be of legal age to acquire a domain name.",
      "placeholder": "true",
      "constraints": []
    }
  ],
  "constraints": []
}
```
:::

### Objets

Dans un premier temps, regardons les élements qui composent la représentation json des conditions d'éligibilité.

- `Rule` : Objet principal représentant les conditions d'éligibilité. Elle contient les autres objets décris dans les autres points. 
- `Label` : Représente une information et une sous-information : authInfo, owner_contact, vat, nom, prénom, etc...
- `Type` : Indique le format d'un label : string, number, bool, contact...
- `Constraint` : Represente les contraintes appliqué à la valeur d'un label. 
  - `Operator` : Représente le type de contrainte appliqué au label.  
- `Condition` : Spécifie les conditions d'application sous forme de `Rule` d'un label ou d'une contrainte. Si la condition (rule) est respecté, alors l'objet associé doit être appliqué.
- `Fields` : Sous-règle sous forme de `Rule£ appliquée à un label de type contact.
- `Placeholder` : Exemple de valeur possible.
- `Description` : Information concernant le champ.
- `And` : Permet de combiner des objets `Rule`
 
En go, le type se définit ainsi : 

```go
type Rule struct {
	AND         []Rule          `json:"and,omitempty"`
	Label       string          `json:"label,omitempty"`
	Type        string          `json:"type,omitempty"`
	Fields      *Rule           `json:"fields,omitempty"`
	Description string          `json:"description,omitempty"`
	PlaceHolder string          `json:"placeholder,omitempty"`
	Constraints RuleConstraints `json:"constraints"`
	Conditions  *Rule           `json:"conditions,omitempty"`
}

type RuleConstraint struct {
	Operator   string           `json:"operator,omitempty"`
	Value      interface{}      `json:"value,omitempty"`
	Values     []interface{}    `json:"values,omitempty"`
	Conditions *Rule            `json:"conditions,omitempty"`
}

```
#### Labels

| Label             | UI suggéré         | Comment                                                   |
|-------------------|--------------------|-----------------------------------------------------------|
| ACCEPT_CONDITIONS | text with checkbox | Conditions particulières à accepter                       |
| REASON            | textarea           | Raison de l'achat du ndd (demandé par certains registres) |
| CLAIMS_NOTICE     | Text with checkbox | Information concernant la "claim notice" à accepter       |
| PROTECTED_CODE    | Input text         | Code demandé lorsqu'un domain est protégé par le registre |
| AUTH_INFO         | Input text         | Code lié au domain pour une demande de transfer           |
| DOMAIN_CONFIG     | Form               | Liste de champs lié à un domain                           |
| ADMIN_ACCOUNT     | Form               | Liste de champs lié au contact administrateur             |
| TECH_ACCOUNT      | Form               | Liste de champs lié au contact technique                  |
| OWNER_CONTACT     | Form               | Liste de champs lié au contact propriétaire               |
| OWNER_LEGAL_AGE   | Text with checkbox | Si particulier, le propriétaire doit être majeur (>18)    |


#### Types

Il y a deux types de label : primitif et objet. Le type est composé de labels de type primitif.

##### Primitif

| Type         | UI suggéré         | Comment                                 |
|--------------|--------------------|-----------------------------------------|
| string       | input text         |                                         |
| string[]     | list of input text |                                         |
| text         | textarea           |                                         |
| bool         | checkbox           |                                         |
| number       | input text         |                                         |
| date_ISO8601 | date picker        | Date doit être au format ISO8601 format |

##### Objet


| Type        | Comment                                 |
|-------------|-----------------------------------------|
| contact     | Contient les champs liés au contact     |
| domain      | Contient les champs liés au domain      |

::: tip 

Le type domain n'est aujourd'hui utilisé que pour les extensions ac.uk, gov.uk. 
Ces domaines ont un processus de création très particulier ainsi que des conditions d'appropriations et d'utilisations très particulieres.

:::

#### Constraints

| Constraint   | UI suggéré                | Comment                                                                |
|--------------|--------------------|------------------------------------------------------------------------|
| required     | petit étoile rouge | Champ est requis                                                       |
| readonly     | champ grisé        | Champ est en lecture seul                                              |
| eq           | -                  | Champ doit être égale à `$value`                                       |
| ne           | -                  | Champ doit être différent de `$value`                                  |
| gt           | -                  | Champ doit être supérieur à `$value`                                   |
| lt           | -                  | Champ doit être inférieur à `$value`                                   |
| maxlength    | -                  | Longueur du champ doit être inférieur à `$value`                       |
| minlength    | -                  | Longueur du champ soit être supérieur à `$value`                       |
| between      | -                  | Champ doit être compris entre $value1 et `$value2`                     |
| contains     | list               | Champ doit être égale à un des éléments contenu dans `$values`         |
| notcontains  | -                  | Champ ne doit pas être égale à un des éléments contenus dans `$values` |
| empty        | -                  | Champ doit être vide                                                   |
| notempty     | -                  | Champ ne doit pas être vide                                            |
| match        | -                  | Champ doit matché `$regexp`                                            |
| shouldbetrue | checkbox           | Champ doit être égale à `true`, `1` ou `"1"`                           |

## Pas à pas

### Contrainte sur un label d'un type primitif

Partons d'un exemple simple. Admettons que nous ayons qu'une seule règle pour la commande d'un nom de domaine qui stipule qui nous demande d'accepter des conditions particulières.

```json
 {
      "label": "ACCEPT_CONDITIONS",
      "type": "bool",
      "description": "Registry has special condition must be accepted. Your domain must hosting only cats",
      "placeholder": "true",
      "constraints": [
        {
          "operator": "required"
        },
        {
          "operator": "shouldbetrue"
        }
      ]
  }
```

Avec ce type de règle, lors de la commande, le domaine doit obligatoirement avoir une [configuration](order#gestion-des-configurations) ayant pour label `ÀCCEPT_CONDITIONS` avec une valeur booléene à `true`, `1` ou `"1"`. 

### La règle AND et OR

Partons maintenant sur un exemple avec une règle sur deux labels : `ACCEPT_CONDITIONS` et `REASON`.
Séparemment ça donnerait quelque chose comme ça :

```json
{
    "label": "ACCEPT_CONDITIONS",
    "type": "bool",
    "description": "Registry has special condition must be accepted. Your domain must hosting only cats",
    "placeholder": "true",
    "constraints": [
      {
        "operator": "required"
      },
      {
        "operator": "shouldbetrue"
      }
    ]
}
```

```json
{
    "label": "REASON",
    "type": "text",
    "description": "Justifier l'achat de ce nom de domaine",
    "placeholder": "Je suis le maire de la ville OVHcity et je veux un nom de domaine pour ma ville",
    "constraints": [
      {
        "operator": "required"
      }
    ]
}
```

Nous pouvons les combiner en utilisant la propriété `and` de l'objet Rule. Elle demande à ce que les tout les labels respectent leurs contraintes respectives.

Voici un exemple :

```json
 
 {
  "and" : [
    {
        "label": "ACCEPT_CONDITIONS",
        "type": "bool",
        "description": "Registry has special condition must be accepted. Your domain must hosting only cats",
        "placeholder": "true",
        "constraints": [
          {
            "operator": "required"
          },
          {
            "operator": "shouldbetrue"
          }
        ]
    },
    {
        "label": "REASON",
        "type": "text",
        "description": "Justifier l'achat de ce nom de domaine",
        "placeholder": "Je suis le maire de la ville OVHcity et je veux un nom de domaine pour ma ville",
        "constraints": [
          {
            "operator": "required"
          }
        ]
    }
  ]
}

```


::: tip

Il existe également une propriété "or" qui, comme son nom l'indique, nécessite qu'au moins un des labels respectent ses contraintes respectives afin que la règle soit valide. Bien qu'il soit présent dans la déclaration du type `domain.configuration.rules.Rule` sur api.ovh.com, celui-ci n'est utilisé dans aucune règle.

:::


### Gestion du type objet

La gestion des contraintes sur un objet est un peu plus complexe dû au fait qu'un objet est composé de champs primitif (un contact est composé d'un nom, d'un prénom, etc...). 
Pour réprésenter les règles sur un objet, le noeud `fields` a été créé. Et celui-ci n'est rien de plus d'un objet de type `rule`. Etant donné qu'un objet contient plusieurs champs, la règle de base d'un objet est toujours de "type" `and`. 

Etant donné qu'on a appris précédemment à gérer une règle `and` sur des types primitifs, on sait gérer une règle d'un type objet.
Voici un exemple de règle sur un objet de type contact. Vous pouvez y voir différents types primitif ainsi que différents type de contraintes.

```json
{
  "label": "OWNER_CONTACT",
  "type": "contact",
  "fields": {
    "and": [
      {
        "label": "firstName",
        "type": "string",
        "description": "Represents the firstname of the owner contact.",
        "placeholder": "lorem",
        "constraints": [
          {
            "operator": "required",
          },
          {
            "operator": "maxlength",
            "value": "255"
          }
        ]
      },
      {
        "label": "lastName",
        "type": "string",
        "description": "Represents the lastname of the owner contact.",
        "placeholder": "lorem",
        "constraints": [
          {
            "operator": "required",
          },
          {
            "operator": "maxlength",
            "value": "255"
          }
        ]
      },
      {
        "label": "email",
        "type": "string",
        "description": "Represents the email of the owner contact.",
        "placeholder": "lorem@ovh.com",
        "constraints": [
          {
            "operator": "required"
          },
          {
            "operator": "maxlength",
            "value": "255"
          }
        ]
      },
      {
        "label": "legalForm",
        "type": "string",
        "description": "Represents the legal status of owner.",
        "placeholder": "individual",
        "constraints": [
          {
            "operator": "contains",
            "values": [
              "association",
              "corporation",
              "individual",
              "other"
            ]
          },
          {
            "operator": "required"
          },
          {
            "operator": "maxlength",
            "value": "255"
          }
        ]
      },
      {
        "label": "address.country",
        "type": "string",
        "description": "Represents the country of the owner contact.",
        "placeholder": "FR",
        "constraints": [
          {
            "operator": "contains",
            "values": [
              "FR",
              "DE",
              "CA"
            ]
          },
          {
            "operator": "required"
          },
        ]
      },
      {
        "label": "address.line1",
        "type": "string",
        "description": "Represents the address of the owner contact.",
        "placeholder": "lorem",
        "constraints": [
          {
            "operator": "required"
          },
          {
            "operator": "maxlength",
            "value": "255"
          }
        ]
      },
      {
        "label": "address.zip",
        "type": "string",
        "description": "Represents the zip of the owner contact.",
        "placeholder": "12345",
        "constraints": [
          {
            "operator": "required",
          },
          {
            "operator": "maxlength",
            "value": "255"
          }
        ]
      }
    ],
    "constraints": []
  },
  "description": "rule related to the owner domain",
  "constraints": [
    {
      "operator": "required"
    }
  ]
}
```

::: tip

Le champs `address` est un peu spécifique. On s'est posé la question d'en faire un type objet ou d'éviter de la verbosité de plus en gardant des types primitif. Nous sommes partis sur la seconde option en commençant les différents éléments d'une adresse par `address.`

:::

### Conditions

Parfois, nous avons besoin de préciser à quel moment une règle doit être appliqué. Par exemple, le nom de l'organisme (`organisationName`) est obligatoire pour un contact non individuel (`legalForm` n'est pas de type `ìndividual`).  Pour cela, nous allons utiliser une condition. La nature de celle-ci est une règle (l'objet `rule`) qui, si elle est valide, "active" la règle qu'elle conditionne. Vous pouvez remplacer le mot `conditions` par le mot `ìf` si cela vous semble plus clair.


Voici un exemple simple purement fictif : un registre veut que les conditions spécifiques (`ACCEPT_CONDITIONS`) doivent être obligatoirement accepté uniquement s'il n'y a pas de raison (`REASON`). Et voici sa représentation sous forme json.

#### Premier exemple

```json
{
  "label": "ACCEPT_CONDITIONS",
  "type": "bool",
  "description": "Registry has special condition must be accepted. Your domain must hosting only cats",
  "placeholder": "Justifier l'achat de ce nom de domaine",
  "constraints": [
    {
      "operator": "required",
      "conditions": {
        "label": "REASON",
        "type": "text",
        "description": "Justifier l'achat de ce nom de domaine",
        "placeholder": "Je suis le maire de la ville OVHcity et je veux un nom de domaine pour ma ville",
        "constraints": [
          {
            "operator": "empty"
          }
        ]
      }
    },
  ]
}
```

Cette règle conditionne la contrainte `required`, si celle-ci n'est pas rempli (la raison a été renseigné), alors la contrainte ne s'applique pas et le champs ACCEPT_CONDITIONS devient optionnel (mais on peut toujours remplir ce champs).  

Il est également possible de vouloir complètement omettre le label ACCEPT_CONDITION en plaçant la condition directement sur le label ACCEPT_CONDITION comme ceci.


```json
{
  "label": "ACCEPT_CONDITIONS",
  "type": "bool",
  "description": "Registry has special condition must be accepted. Your domain must hosting only cats",
  "placeholder": "Justifier l'achat de ce nom de domaine",
  "constraints": [
    {
      "operator": "required",
    },
  ],
  "conditions": {
    "label": "REASON",
    "type": "text",
    "description": "Justifier l'achat de ce nom de domaine",
    "placeholder": "Je suis le maire de la ville OVHcity et je veux un nom de domaine pour ma ville",
    "constraints": [
      {
        "operator": "empty"
      }
    ]
  }
}
```

Dans un cas comme celui-là, si la raison n'est pas vide, alors le champs ACCEPT_CONDITION sera totalement ignoré, peu importe sa valeur.

#### Exemple sur un contact

Prenons maintenant l'exemple plus concret énoncé au début de cette section : Le nom de l'organisme (`organisationName`) est obligatoire pour un contact individuel (`legalForm` n'est pas de type `ìndividual`)

```json
{
  "label": "OWNER_CONTACT",
  "type": "contact",
  "fields": {
    "and": [
      {
        "label": "legalForm",
        "type": "string",
        "description": "Represents the legal status of owner.",
        "placeholder": "individual",
        "constraints": [
          {
            "operator": "contains",
            "values": [
              "association",
              "corporation",
              "individual",
              "other"
            ]
          },
          {
            "operator": "required"
          }
        ]
      },
      {
        "label": "organisationName",
        "type": "string",
        "description": "Represents the organisation of the owner contact",
        "placeholder": "lorem",
        "constraints": [
          {
            "operator": "required",
            "conditions": {
              "label": "OWNER_CONTACT",
              "type": "contact",
              "fields": {
                "label": "legalForm",
                "type": "string",
                "constraints": [
                  {
                    "operator": "ne",
                    "value": "individual"
                  },
                  {
                    "operator": "required"
                  }
                ]
              },
              "constraints": [
                {
                  "operator": "required"
                }
              ]
            }
          }
        ]
      },
    ],
    "constraints": []
  },
  "description": "rule related to the owner domain",
  "constraints": [
    {
      "operator": "required"
    }
  ]
}
```

## Exemples réels

Maintenant que l'on a décortiquer la représentation technique des règles d'éligibilités, voici quelques exemples concrets et réels.

### Règlse génériques 

La plupart des extensions (gltds et ngtld principalement) ont les mèmes règles d'éligibilités. Avoir un contact propriétaire respectants celle-ci permet de posséder la majorité des extensions disponibles.

#### Création

::: details création
::: 
#### Transfer

::: details transfer
::: 


#### Mise à jour

::: details mise à jour
::: 

#### Changement de propriétaire

::: details Changement de propriétaire
::: 

### Cas du .berlin

Le cas de cette extension est intéressant du fait d'une règle un peu particulière. En effet, pour disposer d'un .berlin, le nic admin **ou** le contact propriétaire doit demeuré à Berlin. 

Pour se faire, nous *conditionnons* la *contrainte* de la *valeur* des champs address.country et address.city du contact propriétaire aux valeurs des champs address.country et address.city du nic admin (et vice-versa). 

Cela se traduit de cette manière. (Pour une raison de clareté, on a retiré volontairement les règles sur les autres champs et labels)

::: details berlin


```json
{
  "and": [
    {
      "label": "ADMIN_ACCOUNT",
      "type": "contact",
      "fields": {
        "and": [
          {
            "label": "address.country",
            "type": "string",
            "description": "Represents the country of the admin contact.",
            "placeholder": "DE",
            "constraints": [
              {
                "operator": "eq",
                "value": "DE",
                "conditions": {
                  "label": "OWNER_CONTACT",
                  "type": "contact",
                  "fields": {
                    "and": [
                      {
                        "label": "address.country",
                        "type": "string",
                        "constraints": [
                          {
                            "operator": "ne",
                            "value": "DE"
                          },
                          {
                            "operator": "required"
                          }
                        ]
                      },
                      {
                        "label": "address.city",
                        "type": "string",
                        "constraints": [
                          {
                            "operator": "ne",
                            "value": "Berlin"
                          },
                          {
                            "operator": "required"
                          }
                        ]
                      }
                    ],
                    "constraints": []
                  },
                  "constraints": [
                    {
                      "operator": "required"
                    }
                  ]
                }
              },
              {
                "operator": "required"
              },
              {
                "operator": "maxlength",
                "value": "255"
              }
            ]
          },
          {
            "label": "address.city",
            "type": "string",
            "description": "Represents the city of the admin contact.",
            "placeholder": "Berlin",
            "constraints": [
              {
                "operator": "eq",
                "value": "Berlin",
                "conditions": {
                  "label": "OWNER_CONTACT",
                  "type": "contact",
                  "fields": {
                    "and": [
                      {
                        "label": "address.country",
                        "type": "string",
                        "constraints": [
                          {
                            "operator": "ne",
                            "value": "DE"
                          },
                          {
                            "operator": "required"
                          }
                        ]
                      },
                      {
                        "label": "address.city",
                        "type": "string",
                        "constraints": [
                          {
                            "operator": "ne",
                            "value": "Berlin"
                          },
                          {
                            "operator": "required"
                          }
                        ]
                      }
                    ],
                    "constraints": []
                  },
                  "constraints": [
                    {
                      "operator": "required"
                    }
                  ]
                }
              },
              {
                "operator": "required"
              },
              {
                "operator": "maxlength",
                "value": "255"
              }
            ]
          }
        ],
        "constraints": []
      },
      "description": "rule related to the admin domain",
      "constraints": [
        {
          "operator": "required"
        }
      ]
    },
    {
      "label": "OWNER_CONTACT",
      "type": "contact",
      "fields": {
        "and": [
          {
            "label": "address.city",
            "type": "string",
            "description": "Represents the city of the owner contact.",
            "placeholder": "Berlin",
            "constraints": [
              {
                "operator": "eq",
                "value": "Berlin",
                "conditions": {
                  "label": "ADMIN_ACCOUNT",
                  "type": "contact",
                  "fields": {
                    "and": [
                      {
                        "label": "address.country",
                        "type": "string",
                        "constraints": [
                          {
                            "operator": "ne",
                            "value": "DE"
                          },
                          {
                            "operator": "required"
                          }
                        ]
                      },
                      {
                        "label": "address.city",
                        "type": "string",
                        "constraints": [
                          {
                            "operator": "ne",
                            "value": "Berlin"
                          },
                          {
                            "operator": "required"
                          }
                        ]
                      }
                    ],
                    "constraints": []
                  },
                  "constraints": [
                    {
                      "operator": "required"
                    }
                  ]
                }
              },
              {
                "operator": "required"
              },
              {
                "operator": "maxlength",
                "value": "255"
              }
            ]
          },
          {
            "label": "address.country",
            "type": "string",
            "description": "Represents the country of the owner contact.",
            "placeholder": "FR",
            "constraints": [
              {
                "operator": "eq",
                "value": "DE",
                "conditions": {
                  "label": "ADMIN_ACCOUNT",
                  "type": "contact",
                  "fields": {
                    "and": [
                      {
                        "label": "address.country",
                        "type": "string",
                        "constraints": [
                          {
                            "operator": "ne",
                            "value": "DE"
                          },
                          {
                            "operator": "required"
                          }
                        ]
                      },
                      {
                        "label": "address.city",
                        "type": "string",
                        "constraints": [
                          {
                            "operator": "ne",
                            "value": "Berlin"
                          },
                          {
                            "operator": "required"
                          }
                        ]
                      }
                    ],
                    "constraints": []
                  },
                  "constraints": [
                    {
                      "operator": "required"
                    }
                  ]
                }
              },
              {
                "operator": "required"
              },
              {
                "operator": "contains",
                "values": [
                  "AC",
                  "AD",
                  "AE",
                  "AF",
                  "AG",
                  "AI",
                  "AL",
                  "...",
                  "XK",
                  "YE",
                  "YT",
                  "ZA",
                  "ZM",
                  "ZW"
                ],
                "conditions": {
                  "label": "ADMIN_ACCOUNT",
                  "type": "contact",
                  "fields": {
                    "and": [
                      {
                        "label": "address.country",
                        "type": "string",
                        "constraints": [
                          {
                            "operator": "eq",
                            "value": "DE"
                          },
                          {
                            "operator": "required"
                          }
                        ]
                      },
                      {
                        "label": "address.city",
                        "type": "string",
                        "constraints": [
                          {
                            "operator": "eq",
                            "value": "Berlin"
                          },
                          {
                            "operator": "required"
                          }
                        ]
                      }
                    ],
                    "constraints": []
                  },
                  "constraints": [
                    {
                      "operator": "required"
                    }
                  ]
                }
              },
              {
                "operator": "maxlength",
                "value": "255"
              }
            ]
          }
        ]
      },
      "description": "rule related to the owner domain",
      "constraints": [
        {
          "operator": "required"
        }
      ]
    }
  ],
  "constraints": []
}


```

:::

## APIs

### Get a rule

### Check a rule