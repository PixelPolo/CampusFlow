import { IConfig } from "./iconfig";

export class Config implements IConfig {
    readonly enableServiceWorker = true;
    readonly developmentMode = false;
}
