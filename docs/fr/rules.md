# Gestion des conditions d'éligibilité

## Introduction

L'obtention et la détention d'un nom de domaine sont accompagnées d'obligations légales tel que :
- les conditions d'utilisation d'un nom de domaine. Un .travel doit nécessairement avoir un lien avec l'industrie du tourisme.
- les conditions d'éligibilitées. L'adresse du contact propriétaire d'un .eu doit se situer au sein de l'union européenne.

Ces conditions sont fixées par l'opérateur de l'extension, le registre, et varient selon les extensions tout en évoluant au fil du temps.

Concernant les conditions d'éligibilité, elles concernent des éléments connues du registrar tel que le domain, les contacts ou encore la procédure d'enregistrement. Ces conditions d'éligibilité, qu'on peut appeler règles s'appliquent : 

- Sur les données du **contact propriétaire, administratif et technique**. Par exemple, l'adresse du propriétaire doit se situé au sein de l'union européenne pour un domain .eu.
- Sur des données liées à la **procédure** de demande de création, de transfer, de changement de propriétaire. Par exemple la raison de la création d'un domaine en .fr représentant un nom de ville.

Avec un nombre d'extensions grandissant d'année en année, il devient ingérable de traiter ces différentes règles manuellement. Il devient alors nécessaire d'automatiser la gestion de ces règles. 
En créant une description de ces différentes règles dans un format json, il est possible d'automatiser la génération des différents formulaires requis ainsi que la validation des données saisies. 

## La représentation json


Les conditions d'éligibilités d'un domain peuvent être représenté sous la forme d'un unique objet json **récursif**. 

Voici l'exemple de la représentation json d'un .com que l'on peut obtenir via l'api `/domain/configurationRule` (que nous expliciteront plus tard).

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
                  "AQ",
                  "AR",
                  "AS",
                  "AT",
                  "AU",
                  "AW",
                  "AX",
                  "AZ",
                  "BA",
                  "BB",
                  "BD",
                  "BE",
                  "BF",
                  "BG",
                  "BH",
                  "BI",
                  "BJ",
                  "BL",
                  "BM",
                  "BN",
                  "BO",
                  "BQ",
                  "BR",
                  "BS",
                  "BT",
                  "BW",
                  "BY",
                  "BZ",
                  "CA",
                  "CC",
                  "CD",
                  "CF",
                  "CG",
                  "CH",
                  "CI",
                  "CK",
                  "CL",
                  "CM",
                  "CN",
                  "CO",
                  "CR",
                  "CU",
                  "CV",
                  "CW",
                  "CX",
                  "CY",
                  "CZ",
                  "DE",
                  "DG",
                  "DJ",
                  "DK",
                  "DM",
                  "DO",
                  "DZ",
                  "EA",
                  "EC",
                  "EE",
                  "EG",
                  "EH",
                  "ER",
                  "ES",
                  "ET",
                  "FI",
                  "FJ",
                  "FK",
                  "FM",
                  "FO",
                  "FR",
                  "GA",
                  "GB",
                  "GD",
                  "GE",
                  "GF",
                  "GG",
                  "GH",
                  "GI",
                  "GL",
                  "GM",
                  "GN",
                  "GP",
                  "GQ",
                  "GR",
                  "GS",
                  "GT",
                  "GU",
                  "GW",
                  "GY",
                  "HK",
                  "HN",
                  "HR",
                  "HT",
                  "HU",
                  "IC",
                  "ID",
                  "IE",
                  "IL",
                  "IM",
                  "IN",
                  "IO",
                  "IQ",
                  "IR",
                  "IS",
                  "IT",
                  "JE",
                  "JM",
                  "JO",
                  "JP",
                  "KE",
                  "KG",
                  "KH",
                  "KI",
                  "KM",
                  "KN",
                  "KP",
                  "KR",
                  "KW",
                  "KY",
                  "KZ",
                  "LA",
                  "LB",
                  "LC",
                  "LI",
                  "LK",
                  "LR",
                  "LS",
                  "LT",
                  "LU",
                  "LV",
                  "LY",
                  "MA",
                  "MC",
                  "MD",
                  "ME",
                  "MF",
                  "MG",
                  "MH",
                  "MK",
                  "ML",
                  "MM",
                  "MN",
                  "MO",
                  "MP",
                  "MQ",
                  "MR",
                  "MS",
                  "MT",
                  "MU",
                  "MV",
                  "MW",
                  "MX",
                  "MY",
                  "MZ",
                  "NA",
                  "NC",
                  "NE",
                  "NF",
                  "NG",
                  "NI",
                  "NL",
                  "NO",
                  "NP",
                  "NR",
                  "NU",
                  "NZ",
                  "OM",
                  "PA",
                  "PE",
                  "PF",
                  "PG",
                  "PH",
                  "PK",
                  "PL",
                  "PM",
                  "PN",
                  "PR",
                  "PS",
                  "PT",
                  "PW",
                  "PY",
                  "QA",
                  "RE",
                  "RO",
                  "RS",
                  "RU",
                  "RW",
                  "SA",
                  "SB",
                  "SC",
                  "SD",
                  "SE",
                  "SG",
                  "SH",
                  "SI",
                  "SJ",
                  "SK",
                  "SL",
                  "SM",
                  "SN",
                  "SO",
                  "SR",
                  "SS",
                  "ST",
                  "SV",
                  "SX",
                  "SY",
                  "SZ",
                  "TA",
                  "TC",
                  "TD",
                  "TF",
                  "TG",
                  "TH",
                  "TJ",
                  "TK",
                  "TL",
                  "TM",
                  "TN",
                  "TO",
                  "TR",
                  "TT",
                  "TV",
                  "TW",
                  "TZ",
                  "UA",
                  "UG",
                  "UM",
                  "US",
                  "UY",
                  "UZ",
                  "VA",
                  "VC",
                  "VE",
                  "VG",
                  "VI",
                  "VN",
                  "VU",
                  "WF",
                  "WS",
                  "XK",
                  "YE",
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
      "constraints": [],
      "contexts": [
        "order"
      ]
    }
  ],
  "constraints": []
}
```

Au premier regard, cette règle semble verbeuse et intimidante. Par la suite, nous allons voir pas à pas comment elle est construite.

### Objets

Dans un premier temps, regardons les élements qui composent la représentation json des conditions d'éligibilité.

- `Rule` : Objet de règle principal représentant les conditions d'éligibilité. Elle contient les autres objets décris dans les autres points. 
- `Label` : Représente une information et une sous-information : authInfo, owner_contact, vat, nom, prénom, etc...
- `Type` : Indique le format d'information d'un label : string, number, bool, contact...
- `Constraint` : Represente les contraintes appliqué à la valeur d'un label. 
- `Condition` : Spécifie les conditions d'application d'un label ou d'une contrainte. Une condition est une `rule`. Si la condition (rule) est respecté, alors l'objet associé doit être appliqué.

#### Labels

| Label | UI  | Comment |
| ----- | --- | ------- |
| ACCEPT_CONDITIONS | text with checkbox | Text providing information on specials condition that have be accepted     |
| REASON            | textarea           | Reason for purchase                                                        |
| CLAIMS_NOTICE     | Text with checkbox | Text providing information related to a claim notice that have be accepted |
| PROTECTED_CODE    | Input text         | Code asked when a domain is protected                                      |
| AUTH_INFO         | Input text         | Code asked to transfer a domain from an another registrar                  |
| DOMAIN_CONFIG     | Form               | List of fields related to a domain                                         |
| ADMIN_CONTACT     | Form               | List of fields related to an admin contact                                 |
| TECH_CONTACT      | Form               | List of fields related to an tech contact                                  |
| OWNER_CONTACT     | Form               | List of fields related to an owner contact                                 |
| OWNER_LEGAL_AGE   | Text with checkbox | If individual, customer must be have legal age to purchase a domain        |

#### Types

| Type          | UI                    | Comment                               |
| ------------- | --------------------- | ------------------------------------- |
| string        | input text            |                                       |
| string[]      | list of input text    |                                       |
| text          | textarea              |                                       |
| bool          | checkbox              |                                       |
| number        | input text            |                                       |
| date_ISO8601  | date picker           |  Date must be in ISO8601 format       |
| contact       | -                     |  Contains fields related to a contact |
| domain        | -                     |  Contains fields related to a domain  |

#### Constraints

|   Constraint  |  UI                   | Comment                                    |
| ------------- | --------------------- | ------------------------------------------ |
| required      |  red star             | Field is mandatory                         |
| readonly      |  readonly             | Field can't be changed                     |
| eq            |  -                    | Field must be equal to $value              |
| ne            |  -                    | Field must be differents from $value       |
| gt            |  -                    | Field must be greater than a $value        |
| lt            |  -                    | Field must be lower than $value            |
| maxlength     |  -                    | Size of field must be lower than $value    |
| minlength     |  -                    | Size of field must be greater than $value  |
| between       |  input range          | Field must be between $value1 and $value2  |
| contains      |  select element       | Field must be equals to one of $values     |
| notcontains   |  -                    | Field mustn't be equals  to one of $values |
| empty         |  -                    | Field must be empty                        |
| notempty      |  -                    | Field must not be empty                    |
| match         |  -                    | Field must be match the $regexp            |
| shouldbetrue  |  checkbox             | Field must be checked                      |
