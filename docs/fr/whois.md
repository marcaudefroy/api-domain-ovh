# Whois

## Fonctionnement

## Divulgation des informations

Depuis le RGPD, les données du whois concernant les contacts admin, tech et propriétaire (owner) sont caché par défaut. 

### Récupération des règles de divulgation


`GET /domain/{serviceName}/rules/optin`

| Parameter   | Required | Default | Description               |
|-------------|----------|---------|---------------------------|
| serviceName | true     |         | Le nom de domain souhaité |


:::: tabs

::: tab Go

```go
var rule
err := client.Get("/domain/$serviceName/rules/optin", &rule)
```
:::

::: tab Python

```python
rule = client.get("/domain/$serviceName/rules/optin")
```

::: 
::: tab JavaScript


```javascript
client.requestPromised('GET', '/domain/$serviceName/rules/optin').then(function (rule) {
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
[
  {
    "type": "tech",
    "fields": []
  },
  {
    "type": "owner",
    "fields": [
      "address",
      "city",
      "country",
      "email",
      "fax",
      "name",
      "organisation",
      "phone",
      "province",
      "zip"
    ]
  }
]
```

:::

La réponse ci-dessus indique les 3 types de règles qu'il est possible de rencontrer.
- Le contact admin absent dans la réponse signifie qu'il n'est pas possible de configurer la divulgation des données whois le concernant.
- Le présence du contact tech avec un tableau de `field` vide signifie qu'il est possible de divulguer les informations. Le choix des informations divulgués n'est cependant pas définissable. 
- Concernant le contact owner, c'est la règle la plus customisable. La présence des champs dans le noeud `field` indique qu'il est possible de choisir quels champs seront divulguer dans le whois.

### Récupération de la configuration optin
### Modification de la configuration optin

## Obfuscation d'email

### Récupération de la règle d'obfuscation