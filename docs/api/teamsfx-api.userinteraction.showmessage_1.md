<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@microsoft/teamsfx-api](./teamsfx-api.md) &gt; [UserInteraction](./teamsfx-api.userinteraction.md) &gt; [showMessage](./teamsfx-api.userinteraction.showmessage_1.md)

## UserInteraction.showMessage() method

Show an information/warnning/error message with different colors to users, which only works for CLI.

<b>Signature:</b>

```typescript
showMessage(level: "info" | "warn" | "error", message: Array<{
        content: string;
        color: Colors;
    }>, modal: boolean, ...items: string[]): Promise<Result<string | undefined, FxError>>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  level | "info" \| "warn" \| "error" | message level |
|  message | Array&lt;{ content: string; color: [Colors](./teamsfx-api.colors.md)<!-- -->; }&gt; | The message with color to show. The color only works for CLI. |
|  modal | boolean |  |
|  items | string\[\] | A set of items that will be rendered as actions in the message. |

<b>Returns:</b>

Promise&lt;Result&lt;string \| undefined, [FxError](./teamsfx-api.fxerror.md)<!-- -->&gt;&gt;

A promise that resolves to the selected item or `undefined` when being dismissed.
