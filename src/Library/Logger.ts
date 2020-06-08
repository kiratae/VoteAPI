import { ILogger } from "./ILogger";

export class Logger implements ILogger {

    private Name: String;

    constructor(name: String){
        this.Name = name;
    }

    public Debug(msg: string, ...supportingDetails: any[]): void {
        this.emitLogMessage('debug', msg, supportingDetails);
    }

    public Warn(msg: string, ...supportingDetails: any[]): void {
        this.emitLogMessage('debug', msg, supportingDetails);
    }

    public Error(msg: string, ...supportingDetails: any[]): void {
        this.emitLogMessage('error', msg, supportingDetails);
    }

    public Info(msg: string, ...supportingDetails: any[]): void {
        this.emitLogMessage('info', msg, supportingDetails);
    }

    private emitLogMessage(msgType: "debug" | "warn" | "error" | "info", msg: string, supportingDetails: any[]) {
        let message = `${this.Name}: ${msg}`
        if (supportingDetails.length > 0) {
            console[msgType](message, supportingDetails);
        } else {
            console[msgType](message);
        }
    }

}