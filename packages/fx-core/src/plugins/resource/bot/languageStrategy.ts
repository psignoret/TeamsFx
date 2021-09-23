// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import * as utils from "./utils/common";
import { ProgrammingLanguage } from "./enums/programmingLanguage";
import { TemplateManifest } from "./utils/templateManifest";
import { DownloadConstants, TemplateProjectsConstants } from "./constants";
import { Commands } from "./resources/strings";

import * as appService from "@azure/arm-appservice";
import { NameValuePair } from "@azure/arm-appservice/esm/models";
import AdmZip from "adm-zip";
import {
  CommandExecutionError,
  SomethingMissingError,
  TemplateZipFallbackError,
  UnzipError,
} from "./errors";
import { downloadByUrl } from "./utils/downloadByUrl";
import * as path from "path";
import * as fs from "fs-extra";
import { Logger } from "./logger";
import { Messages } from "./resources/messages";
import { getTemplatesFolder } from "../../..";
import {
  ScaffoldAction,
  ScaffoldActionName,
  ScaffoldContext,
  scaffoldFromTemplates,
} from "../../../common/templatesActions";

export class LanguageStrategy {
  public static convertTemplateLanguage(language: ProgrammingLanguage): string {
    switch (language) {
      case ProgrammingLanguage.JavaScript:
        return "js";
      case ProgrammingLanguage.TypeScript:
        return "ts";
    }
  }

  public static async getTemplateProjectZip(group_name: string, config: any): Promise<void> {
    await scaffoldFromTemplates({
      group: group_name,
      lang: LanguageStrategy.convertTemplateLanguage(config.scaffold.programmingLanguage!),
      scenario: TemplateProjectsConstants.DEFAULT_SCENARIO_NAME,
      templatesFolderName: TemplateProjectsConstants.TEMPLATE_FOLDER_NAME,
      dst: config.scaffold.workingDir!,
      onActionEnd: async (action: ScaffoldAction, context: ScaffoldContext) => {
        if (action.name === ScaffoldActionName.FetchTemplatesUrlWithTag) {
          Logger.info(Messages.SuccessfullyRetrievedTemplateZip(context.zipUrl ?? ""));
        }
      },
      onActionError: async (action: ScaffoldAction, context: ScaffoldContext, error: Error) => {
        Logger.info(error.toString());
        switch (action.name) {
          case ScaffoldActionName.FetchTemplatesUrlWithTag:
          case ScaffoldActionName.FetchTemplatesZipFromUrl:
            Logger.info(Messages.FallingBackToUseLocalTemplateZip);
            break;
          case ScaffoldActionName.FetchTemplateZipFromLocal:
            throw new TemplateZipFallbackError();
          case ScaffoldActionName.Unzip:
            throw new UnzipError(context.dst);
          default:
            throw new Error(error.message);
        }
      },
    });
  }

  public static getSiteEnvelope(
    language: ProgrammingLanguage,
    appServicePlanName: string,
    location: string,
    appSettings?: NameValuePair[]
  ): appService.WebSiteManagementModels.Site {
    const siteEnvelope: appService.WebSiteManagementModels.Site = {
      location: location,
      serverFarmId: appServicePlanName,
      siteConfig: {
        appSettings: [],
      },
    };

    if (!appSettings) {
      appSettings = [];
    }

    appSettings.push({
      name: "SCM_DO_BUILD_DURING_DEPLOYMENT",
      value: "true",
    });

    appSettings.push({
      name: "WEBSITE_NODE_DEFAULT_VERSION",
      value: "12.13.0",
    });

    appSettings.forEach((p: NameValuePair) => {
      siteEnvelope?.siteConfig?.appSettings?.push(p);
    });

    return siteEnvelope;
  }

  public static async localBuild(
    programmingLanguage: ProgrammingLanguage,
    packDir: string,
    unPackFlag?: boolean
  ): Promise<void> {
    if (programmingLanguage === ProgrammingLanguage.TypeScript) {
      //Typescript needs tsc build before deploy because of windows app server. other languages don"t need it.
      try {
        await utils.execute("npm install", packDir);
        await utils.execute("npm run build", packDir);
      } catch (e) {
        throw new CommandExecutionError(`${Commands.NPM_INSTALL},${Commands.NPM_BUILD}`, e);
      }
    }

    if (programmingLanguage === ProgrammingLanguage.JavaScript) {
      try {
        // fail to npm install @microsoft/teamsfx on azure web app, so pack it locally.
        await utils.execute("npm install", packDir);
      } catch (e) {
        throw new CommandExecutionError(`${Commands.NPM_INSTALL}`, e);
      }
    }
  }
}
