<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@microsoft/teamsfx](./teamsfx.md) &gt; [setLogFunction](./teamsfx.setlogfunction.md)

## setLogFunction() function

> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.
> 

Set custom log function. Use the function if it's set. Priority is lower than setLogger.

<b>Signature:</b>

```typescript
export declare function setLogFunction(logFunction?: LogFunction): void;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  logFunction | [LogFunction](./teamsfx.logfunction.md) | custom log function. If it's undefined, custom log function will be cleared. |

<b>Returns:</b>

void
