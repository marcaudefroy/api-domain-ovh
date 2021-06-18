# Introduction

Bienvenue sur la documentation de l'AP domaine OVHcloud

## Pré-requis à cette documentation

Afin de continuer à lire cette documentation, il t'est nécessaire de prendre connaissance en premier lieu de ces documentations ci-dessous. Elles t'aideront à mettre en place ton environnemnt ainsi que de comprendre le fonctionnement de la signature de tes futures requêtes.

- [Premiers pas avec les API OVHcloud](https://docs.ovh.com/fr/api/api-premiers-pas/)
- [First Steps with the API](https://docs.ovh.com/gb/en/customer/first-steps-with-ovh-api/)


## SDK disponibles


Afin de faciliter la signature des requêtes et les appels à l'api, des sdks sont disponibles dans plusieurs langages :

- Perl: [https://eu.api.ovh.com/wrappers/OvhApi-perl-1.1.zip](https://eu.api.ovh.com/wrappers/OvhApi-perl-1.1.zip)
- Python: [https://github.com/ovh/python-ovh](https://github.com/ovh/python-ovh)
- PHP: [https://github.com/ovh/php-ovh](https://github.com/ovh/php-ovh)
- Node.js: [https://github.com/ovh/node-ovh](https://github.com/ovh/node-ovh)
- Swift: [https://github.com/ovh/swift-ovh](https://github.com/ovh/swift-ovh)
- C#: [https://github.com/ovh/csharp-ovh](https://github.com/ovh/csharp-ovh)
- Go : [https://github.com/ovh/go-ovh](https://github.com/ovh/go-ovh)


:::: tabs

::: tab Go
```go
package main

import (
	"fmt"
	"github.com/ovh/go-ovh/ovh"
)

func main() {
  client, err :=  ovh.NewClient(
		"ovh-eu",
		YOUR_APPLICATION_KEY,
		YOUR_APPLICATION_SECRET,
		YOUR_CONSUMER_KEY,
	)
	if err != nil {
		fmt.Printf("Error: %q\n", err)
		return
	}
}
```
:::


::: tab Python
```python

import ovh

client = ovh.Client(
    endpoint='ovh-eu',
    application_key='<application key>',
    application_secret='<application secret>',
    consumer_key='<consumer key>',
)
```
:::

::: tab JavaScript
```javascript

var client = require('ovh')({
  endpoint: 'ovh-eu',
  appKey: APP_KEY,
  appSecret: APP_SECRET,
  consumerKey: APP_CONSUMER_KEY
});

```
:::

::::


## Vocabulaire

Ci-dessous un glossaire des termes employés dans cette documentation.

- Registre : Organisme détenteur d'une extension. Par exemple, le .fr appartient à l'Afnic, le .com et le .net à Verisign.
- Registrar : Revendeur de noms de domaines. Le registre passe par un registrar afin de vendre son nom de domaine. OVHcloud est un registar.
- Registrant : Propriétaire d'un nom de domaine. Il porte la responsabilité légale de l'utilisation du nom de domaine et possède tout les droits sur le nom de domaine.
- gtld (Generic Top Level Domain) : Domain d