export class AppSettings {
  public static get API_ENDPOINT(): string { return 'https://api.cebroker.com/v1/cerenewaltransactions/GetLogsRecordData'; }
  public static getApiEndpoint(method: string): string {
      return `${AppSettings.API_ENDPOINT}${method}`;
  }
}
