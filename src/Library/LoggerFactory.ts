import { Logger } from "./Logger";

export class LoggerFactory {

    private constructor(){}

    public static GetLogger(name: string): Logger {
        return new Logger(name);
    }

}
