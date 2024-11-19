import Aurelia from "aurelia";
import { RouterConfiguration } from "@aurelia/router";
import { MyApp } from "./my-app";
import { AllConfiguration } from "@aurelia-mdc-web/all";

Aurelia.register(
  RouterConfiguration.customize({ useUrlFragmentHash: true, useHref: false }),
  AllConfiguration
)
  // To use HTML5 pushState routes, replace previous line with the following customized router config.
  // .register(RouterConfiguration.customize({ useUrlFragmentHash: false }))
  .app(MyApp)
  .start();
