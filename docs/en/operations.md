TODO

## Operation workflow

The nominal lifecycle of an operation is simply:

- `todo`: the operation has been created but is not currently being treated. Most operations (`DomainCreate`, `DomainRenew`, etc.) are executed in the minute, and finalized in 5 to 10 minutes.
- `doing`: the operation is currently being executed.
- `done`: the operation terminated successfully. This is a final status.

Some additional statuses can occur under non nominal circumstances:

- `cancelled`: the operation was cancelled, either by the customer, or by OVHcloud. This is a final status.
- `error`: something wrong occurred during the execution. Two possibilities:
  1. Some information provided by the customer is invalid or missing: in this case you'll have the possibility to update the arguments and relaunch the operation,
  2. A problem occurred on our side: in this case you won't be able to relaunch yourself. We'll relaunch periodically, but you will have to open a support ticket if the operation doesn't fix itself after a while.
