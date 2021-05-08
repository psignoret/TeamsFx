# Local Debug FAQ

## Which ports will be used?
| Port | Component |
| --- | --- |
| 3000 | Tab |
| 5000 | Auth |
| 7071 | Function |
| 9229 | Node inspector for Function |
| 3978 | Bot / Messaging Extension |
| 9239 | Node inspector for Bot / Messaging Extension |

## What to do if some port is already in use?
This issue may look like:

![Port Already In Use](../images/fx-core/localdebug/port-already-in-use.png)

This is mainly because this port was not successfully closed after last local debug. You can follow the scripts below to find the process that occupies this port, and to kill that process. After the process is killed, start debugging again.

### Windows
In cmd or powershell:
```cmd
> netstat -ano | findstr <port>
> tskill <process id>
```

### Linux / OSX
In shell:
```shell
$ lsof -i:<port>
$ kill <process id>
```

## What to do if Teams shows "App not found" when the Teams web client is opened?
This issue may look like:

![App Not Found](../images/fx-core/localdebug/app-not-found.png)

This is mainly because the Teams account you logged in when the Teams web client is opened is different from the M365 account you logged in when developing the Teams app. Please make sure you use the same M365 account. After logging in the correct account, start debugging again.

You can see which M365 account you logged in via Teams toolkit, like:

![Teams Toolkit M365 Account](../images/fx-core/localdebug/m365-account.png)

## What to do if Teams shows "Permission needed" when the Teams web client is opened?
This issue may look like:

![Permission Needed](../images/fx-core/localdebug/permission-needed.png)

This is mainly because the custom app uploading is not turned on for your Teams tenant. You can follow [this document](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/prepare-your-o365-tenant#enable-custom-teams-apps-and-turn-on-custom-app-uploading) to turn it on.

## What to do if I want to use my own tunneling service instead of the built-in one for Bot or Messaging Extension?
Since Bot and Messaging Extension requires a public address as the messaging endpoint, ngrok will be used by default to automatically create a tunnel connection forwarding localhost address to public address.

To use your own tunneling service, set the following configurations in *.fx/default.userdata* under the project root, then start debugging, like:
```
fx-resource-local-debug.skipNgrok=true
fx-resource-local-debug.localBotEndpoint=https://767787237c6b.ngrok.io
```
Please note that the `localBotEndpoint` should use https protocol.

## What to do if I do not want to trust the development certificate?
Since Teams requires https Tab hosting endpoint, a localhost development certificate will be automatically generated and needs your trust when debugging. You can follow the script bellow to skip this step.

Set the following configuration in *.fx/default.userdata* under the project root, then start debugging, like:
```
fx-resource-local-debug.trustDevCert=false
```
If so, an error will show in the Tab page of your app, look like:

![Tab-Https-Not-Trusted](../images/fx-core/localdebug/tab-https-not-trusted.png)

To resolve this issue, open a new tab in the same browser, go to https://localhost:3000/index.html#/tab, click the "Advanced" button and then select "Proceed to localhost (unsafe)". After doing this, refresh the Teams web client.

![Continue-To-Localhost](../images/fx-core/localdebug/continue-to-localhost.png)