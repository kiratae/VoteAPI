export interface ILogger {

    Debug(message: string, ...supportingData: any[]): void;

    Warn(message: string, ...supportingData: any[]): void;

    Error(message: string, ...supportingData: any[]): void;

    Info(message: string, ...supportingData: any[]): void;

}