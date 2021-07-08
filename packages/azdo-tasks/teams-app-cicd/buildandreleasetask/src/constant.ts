/* eslint-disable @typescript-eslint/no-extraneous-class */
export class ActionInputs {
  static readonly ProjectRoot: string = 'projectRoot'
  static readonly OperationType: string = 'operationType'
  static readonly Capabilities: string = 'capabilities'
}

export class ActionOutputs {
  static readonly ConfigFilePath: string = 'configFilePath'
  static readonly SharepointPackagePath: string = 'sharepointPackagePath'
  static readonly PackageZipPath: string = 'packageZipPath'
}

export class Commands {
  static readonly NpmInstall: string = 'npm install'
  static readonly NpmRunBuild: string = 'npm run build'
  static readonly TeamsfxProvision = (subscriptionId: string): string =>
    `npx @microsoft/teamsfx-cli provision --subscription ${subscriptionId}`
  static readonly TeamsfxDeploy: string = 'npx @microsoft/teamsfx-cli deploy'
  static readonly TeamsfxBuild: string = 'npx @microsoft/teamsfx-cli build'
  static readonly TeamsfxValidate: string =
    'npx @microsoft/teamsfx-cli validate'
  static readonly TeamsfxPublish: string = 'npx @microsoft/teamsfx-cli publish'
}

export class Pathes {
  static readonly EnvDefaultJson: string = '.fx/env.default.json'
  static readonly PackageSolutionJson: string =
    'SPFx/config/package-solution.json'
  static readonly TeamsAppPackageZip: string = '.fx/appPackage.zip'
}

export class Miscs {
  static readonly SolutionConfigKey: string = 'solution'
  static readonly BotConfigKey: string = 'fx-resource-bot'
  static readonly LanguageKey: string = 'programmingLanguage'
}

export class ErrorNames {
  static readonly InputsError: string = 'InputsError'
  static readonly LanguageError: string = 'LanguageError'
  static readonly EnvironmentVariableError: string = 'EnvironmentVariableError'
  static readonly SpfxZippedPackageMissingError: string =
    'SpfxZippedPackageMissingError'
  static readonly InternalError: string = 'InternalError'
}

export class Suggestions {
  static readonly CheckInputsAndUpdate: string =
    'Please check and update the input values.'
  static readonly CheckEnvDefaultJson: string = `Please check the content of ${Pathes.EnvDefaultJson}.`
  static readonly CheckPackageSolutionJson: string = `Please check the content of ${Pathes.PackageSolutionJson}.`
  static readonly RerunWorkflow: string =
    'Please rerun the workflow or pipeline.'
  static readonly CreateAnIssue: string = 'Please create an issue on GitHub.'
}
