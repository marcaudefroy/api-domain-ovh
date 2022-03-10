# Order a Domain Name

## Order API

Before ordering your domain names, we describe the different objects which can be accessed and manipulated through the API.

### The _Cart_

The _cart_ object from the API represents an order cart. Different actions are possible:

- Create: can be performed without authentication
- Assign to a Nic: required to validate a cart
- Add products to the cart
- Preview cart
- Request validation in "dry-run" mode (without generating a purchase order)
- Generate a purchase order from the cart contents

These API routes start with `/order/cart/`

### The _Products_

An _item_ represents a product which can be added to a cart. Possible actions:

- Check product availability
- Add/update/remove a product in a cart
- Get required product configurations before the cart can be validated
- Add/remove a product configuration

The API routes used to perform these actions start with `/order/cart/{cartID}/item/`

### Workflow

In general, ordering an OVHcloud product with the API will follow these steps:

1. Create a cart
1. Fetch available offers for the requested product
1. Add the requested product to the cart
1. Preview a cart summary (optional)
1. Fetch required configurations for the product
1. Add the required configurations
1. "Dry-run" validation of the cart (optional)
1. Validate the cart

## Cart Creation

The first step when ordering a domain name is to create a cart with this API route:

```text
POST /order/cart
```

| Parameter     | Required | Default     | Description                 |
| ------------- | -------- | ----------- | --------------------------- |
| ovhSubsidiary | yes      |             | OVHcloud subsidiary         |
| description   | no       | ""          | Customized cart description |
| expire        | no       | now + 1 day | Cart expiration             |

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
    // Cart
  })
  .catch(function(err) {
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
  "items": []
}
```

:::

Write down the `cartId` attribute somewhere, as it will be used in the next steps.

## Fetch Available Offers

The second step consists in fetching available offers for a domain name.

```text
GET /order/cart/{cartID}/domain
```

| Parameter | Required | Default | Description         |
| --------- | -------- | ------- | ------------------- |
| domain    | yes      | ""      | Desired domain name |

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

::: details Response

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

There are 4 important values in this payload:

1. The _action_: what can be done on the domain name, it could be a "transfer" or a "create"
2. The _duration_: represents the period during which the domain name may be ordered. For a domain, P1Y (period 1 year) orders the domain for 1 year, P2Y for 2 years, etc...
3. The _offerId_: name of the offer, which should be included when adding the domain to the cart
4. The _pricing-mode_: offer detail, which will also be included when adding the domain

There are two ways to determine the domain name status according to the API response.

The first one consists in a mapping between the pricing-mode and the domain status. Below is the exhaustive mapping table.

| Pricing-mode                                 | Description                                                                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| create-default                               | Domain is available at the standard price                                                                                             |
| create-premium                               | Domain is available, but with premium pricing. Its price depends on the domain name                                                   |
| transfer-default                             | Domain is not available, but transferable if you are the owner. Transfer comes at standard price                                      |
| transfer-premium                             | Domain is not available, but transferable if you are the owner. Transfer comes with premium pricing, which depends on the domain name |
| transfer-aftermarket1, transfer-aftermarket2 | Domain is available on an aftermarket platform. Its price depends on the domain                                                       |

The second option, **deprecated and which will be removed soon**, consists in analyzing the pair pricing-mode/offerId.

| Pricing-mode               | offerId                                          | Description                                                                                                                           |
| -------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| default                    | \$extension-create (fr-create, com-create)       | Domain is available at the standard price                                                                                             |
| premium                    | \$extension-create (fr-create, com-create)       | Domain is available, but with premium pricing. Its price depends on the domain                                                        |
| default                    | \$extension-transfer (fr-transfer, com-transfer) | Domain is not available, but transferable if you are the owner. Transfer comes at standard price                                      |
| premium                    | \$extension-transfer (fr-transfer, com-transfer) | Domain is not available, but transferable if you are the owner. Transfer comes with premium pricing, which depends on the domain name |
| aftermarket1, aftermarket2 | \$extension-transfer (fr-transfer, com-transfer) | Domain is available on an aftermarket platform. Its price depends on the domain                                                       |

::: tip INFO
For now, even if the response is an array, only 1 offer is returned.
In the future, it could happen than several offers are returned for a single domain name.
For example, a domain name could be at the same time transferable from another registrar, or available on an aftermarket platform.
:::

## Add a Domain Name to the Cart

While the second step is optional, this one is mandatory to order a domain name.
The following call allows to add the desired domain to the cart:

```text
POST /order/cart/{cartID}/domain
```

| Parameter   | Required | Default | Description                                                                                             |
| ----------- | -------- | ------- | ------------------------------------------------------------------------------------------------------- |
| domain      | yes      |         | The desired domain name                                                                                 |
| duration    | no       |         | Duration of the order. Values higher than P1Y may be used on some extensions, but can never exceed P10Y |
| offerId     | no       |         | Available offer for the domain. Only one value is allowed, see step above to fetch it (deprecated)      |
| quantity    | no       |         | For now, only value "1" is allowed                                                                      |
| planCode    | no       |         | Represents the order plan for the domain                                                                |
| pricingMode | no       |         | Represents the offer related to the domain plan                                                         |

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

  // optional
  PlanCode:    "fr",
  PricingMode: "default-create"
  Quantity:    1,
  Duration:    "P1Y",

  // deprecated
  OfferId: "fr-create",
}
err := client.Post("/order/cart", data, &item)
```

:::

::: tab Python

```python
itemData = {
  "domain" : "foo.fr"

  # optional
  "planCode":    "fr",
  "pricingMode": "default-create",
  "quantity":    1,
  "duration":    "P1Y",

  # deprecated
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
    // optional

    planCode: "fr",
    pricingMode: "default-create",
    quantity: 1,
    duration: "P1Y",

    // deprecated
    offerId: "fr-create"
  })
  .then(function(item) {
    // item
  })
  .catch(function(err) {
    // returns an error object {error: statusCode, message: message}
  });
```

:::

::::

::: details Response

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

Write down the `itemId` value, as it will be used in the next steps.

## Cart Summary

This step is optional. It returns a preview of the cart contents, but does not check cart consistency or configuration.

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
    // summary
  })
  .catch(function(err) {
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

Without looking into the details of this payload, a couple of things are worth noting:

- Adding an item to the cart produces two lines of details on the purchase order
- An extra line is added when a promotion is used (`detailType` = `GIFT`)
- The `prices` object represents the cart total price, with and without taxes
- The contract list is empty in the summary. It will be filled after validation, or purchase order creation

::: tip A note on the DNS zone

You may be surprised by the returned DNS zone (represented with two lines of details), since it was not added to the cart.
This is a frequently ignored notion. A domain name and a DNS zone are two distinct things (products in the cart): the domain name may be managed by OVHcloud while the DNS zone may be hosted elsewhere.

However, since the two are strongly tied and to ease the order process, we chose to add a DNS zone automatically when a domain name is ordered.
Of course, you may add it manually to add options such as DNSSEC or DNS Anycast. We will write about it later, when considering product options.

:::

## Assigning the Cart

Even though this operation may be done right after the cart creation, it is mandatory to proceed.
As we will see later indeed, domain configurations and their validation depends on the OVHcloud nic assigned to the cart.

```text
POST /order/cart/{cartId}/assign
```

## Configurations Management

At this point, the cart contains a domain name.
It is necessary to add required configurations to be able to validate it and generate a purchase order.

### Fetch Required Configurations

To know which configurations are required, you should call this API endpoint.

```text
GET /order/cart/{cartId}/item/{itemId}/requiredConfiguration
```

| Parameter | Required | Default | Description              |
| --------- | -------- | ------- | ------------------------ |
| cartId    | yes      | ""      | Cart identifier          |
| itemId    | yes      | ""      | Inserted item identifier |

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
    // offers
  })
  .catch(function(err) {
    // returns an error object
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

The above response represents the most standard return value found when creating a domain name.
It depends on the desired action (transfer, creation), extension or the type of domain (premium, aftermarket).

Below is the exhaustive list of required configurations for a domain name.

| Label             | Type                           | Required             | Description                                                                                                                                                                                                                                                                                                       |
| ----------------- | ------------------------------ | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ADMIN_ACCOUNT     | string                         | no                   | Represents the OVHcloud nic which will be able to administrate the domain, and which will be its administrator on the Whois. If empty, the nic used to call the API will be used. Expects a valid nic value of the form xxx-ovh                                                                                   |
| TECH_ACCOUNT      | string                         | no                   | Represents the OVHcloud nic which will be able to technically manage the domain, and which will be its technical manager on the Whois. If empty, the nic used to call the API will be used. Expects a valid nic value of the form xxx-ovh                                                                         |
| OWNER_CONTACT     | /me/contact or /domain/contact | no                   | Represents the domain name owner. If empty, the nic used to call the API will be used as a template to create this contact. Expects a string following pattern /me/contact/1234 or /domain/contact/12345                                                                                                          |
| DOMAIN_CONFIG     | json                           | depends on extension | Usually not present, it is related to some extension constraints (gov.uk, for example)                                                                                                                                                                                                                            |
| ACCEPT_CONDITIONS | bool                           | yes, if present      | Indicates that particular conditions of the extension have been accepted before ordering                                                                                                                                                                                                                          |
| REASON            | string                         | yes, if present      | Indicates the reason why the domain is ordered to the registry. It is usually used for reserved domain names, like city names                                                                                                                                                                                     |
| CLAIMS_NOTICE     | string                         | yes, if present      | Indicates that a claim notice (related to a trademark) is present on the domain. If so, then the domain is protected by some company holding the trademark, which will be notified of the order request. If the registrant is not the trademark holder, the domain name may be removed at any time without refund |
| PROTECTED_CODE    | string                         | yes, if present      | Some domains are reserved by the registry and require a specific code to order them                                                                                                                                                                                                                               |
| OWNER_LEGAL_AGE   | bool                           | yes                  | Used to legally certify that the domain registrant is old enough to order a domain name                                                                                                                                                                                                                           |

::: danger Advanced rules related to contacts and domain names

Be aware that this API is designed for most OVHcloud products.
However, domain names have specific and much more complex rules regarding some configuration values.
It is the case for the ADMIN_ACCOUNT, OWNER_CONTACT and DOMAIN_CONFIG in particular, since they are related to specific registry rules.

For example, to obtain a .berlin domain name, either the owner or the admin contact must be based in Berlin.
However, this API can not describe such constraints.

In order to handle these cases, there are other API routes to send required data in a more precise way.
These routes being more complex and used outside of the order process (such as contact update), they are described in their own section: [Rules Management](rules).
:::

::: warning OWNER_CONTACT configuration

Here, the OWNER_CONTACT represents a "resource" API, namely /me/contact, or more precisely /domain/contact.
The API routes used to create these contacts are described in section [Contact Management](contacts).

:::

### CRUD on Product Configurations

Now that we have fetched the required configurations list, we should add them to the product.

#### Add Configuration

```text
POST /order/cart/{cartId}/item/{itemId}/configuration
```

| Parameter | Required | Default | Description                 |
| --------- | -------- | ------- | --------------------------- |
| cartId    | yes      | ""      | Cart identifier             |
| itemId    | yes      | ""      | Item identifier in the cart |

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
    // returns an error object {error: statusCode, message: message}
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

#### Fetch Product Configurations

```text
GET /order/cart/{cartId}/item/{itemId}/configuration
```

#### Fetch Configuration Value

```text
GET /order/cart/{cartId}/item/{itemId}/configuration/{configurationId}
```

#### Configuration Removal

```text
DELETE /order/cart/{cartId}/item/{itemId}/configuration/{configurationId}
```

## Cart Management

Of course, at any time, you may visualize and manipulate the cart with the following API routes.

#### Fetch Items

```text
GET /order/cart/{cartId}
```

#### Fetch Item Details

```text
GET /order/cart/{cartId}/item/{itemId}
```

#### Item Removal

```text
DELETE /order/cart/{cartId}/item/{itemId}
```

## Cart Validation

This step is probably the most important of the order process, and can be performed with this API call.

```text
GET /order/cart/{cartId}/checkout
```

It allows to get the final purchase order, without generating it (it is a "dry-run").
The returned object contains the contracts associated with the different products.

This call also validates the configurations, like owner eligibility for a domain name.

## Create Purchase Order

```text
POST /order/cart/{cartId}/checkout
```

| Parameter                         | Required | Default | Description                                                                            |
| --------------------------------- | -------- | ------- | -------------------------------------------------------------------------------------- |
| autoPayWithPreferredPaymentMethod | yes      | ""      | Used to automatically pay the purchase order with de default payment method of the nic |
| waiveRetractationPeriod           | yes      | ""      | Required for a domain name, it is used to waive your right to retract                  |

## Pay Purchase Order

If the purchase order was not paid automatically with default payment method in the previous step, you will have to use purchase order management APIs.
We assume that at least 1 payment method is registered in your account (if not, there are API routes to manage them).

### Fetch Available Payment Methods

First, let us fetch available payment methods for the purchase order above with the [following route](https://api.ovh.com/console/#/me/order/%7BorderId%7D/availableRegisteredPaymentMean#GET).

```text
GET /me/order/{orderId}/availableRegisteredPaymentMean
```

| Parameter | Required | Default | Description                                                                               |
| --------- | -------- | ------- | ----------------------------------------------------------------------------------------- |
| orderId   | yes      | ""      | Purchase order identifier obtained when [creating purchase order](#create-purchase-order) |

:::: tabs

::: tab Go

```go
type RegisteredPaymentMean struct {
   PaymentMean string `json:"paymentMean"`
}
/* Possible values:
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
    // result
  })
  .catch(function(err) {
    // returns an error object {error: statusCode, message: message}
  });
```

:::

::::

::: details Response

```json
[
  {
    "paymentMean": "bankAccount"
  }
]
```

:::

### Pay Purchase Order

The purchase order can be paid using the [API route below](https://api.ovh.com/console/#/me/order/{orderId}/payWithRegisteredPaymentMean#POST). It does not return any data, but status 200 indicates that it succeeded.

```text
POST /me/order/{orderId}/payWithRegisteredPaymentMean
```

| Parameter     | Required                  | Default | Description                                                                                       |
| ------------- | ------------------------- | ------- | ------------------------------------------------------------------------------------------------- |
| orderId       | yes                       | ""      | Purchase order identifier obtained when [creating purchase order](#create-purchase-order)         |
| paymentMean   | yes                       | ""      | Payment method fetched when [listing available payment methods](#fetch-available-payment-methods) |
| paymentMeanId | depends on payment method | ""      | Required when payment method is `bankAccount`, `creditCard`, or `paypal`                          |

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
    // returns an error object
  });
```

:::

::::

::: details Response

```json
// null
```

:::

## Purchase Order Follow-up

The following [API route](https://api.ovh.com/console/#/me/order/{orderId}/status#GET) allows to get the purchase order status.

```text
GET /me/order/{orderId}/status
```

| Parameter | Required | Default | Description                                                                               |
| --------- | -------- | ------- | ----------------------------------------------------------------------------------------- |
| orderId   | yes      | ""      | Purchase order identifier obtained when [creating purchase order](#create-purchase-order) |

:::: tabs

::: tab Go

```go
type orderStatus string
/* Possible values for orderStatus:
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
  .then(function(result) {
    // result
  })
  .catch(function(err) {
    // returns an error object {error: statusCode, message: message}
  });
```

:::

::::

::: details Response

```json
"notPaid"
```

:::
