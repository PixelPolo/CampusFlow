import { IConfig } from "./iconfig";

export class Config implements IConfig {
    readonly enableServiceWorker = false;
    readonly developmentMode = true;
}
