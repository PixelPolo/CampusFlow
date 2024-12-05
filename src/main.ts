import Aurelia from "aurelia";
import { RouterConfiguration } from "@aurelia/router";
import { MyApp } from "./my-app";
import { AllConfiguration } from "@aurelia-mdc-web/all";
import { SVGAnalyzer } from "@aurelia/runtime-html";
import { CircularProgressConfiguration } from "@aurelia-mdc-web/circular-progress";

Aurelia.register(
  RouterConfiguration.customize({ useUrlFragmentHash: true, useHref: false }),
  AllConfiguration,
  CircularProgressConfiguration
)

  // To use HTML5 pushState routes, replace previous line with the following customized router config.
  // .register(RouterConfiguration.customize({ useUrlFragmentHash: false }))
  .register(SVGAnalyzer)
  .app(MyApp)
  .start();
