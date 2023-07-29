import { Controller, Get } from "@nestjs/common";
import { pick } from "lodash";
import { InjectSentry, SentryService } from "@travelerdev/nestjs-sentry";
import packageJSON from "../package.json";

@Controller()
export class AppController {
  constructor(@InjectSentry() private readonly client: SentryService) {}

  @Get("/status")
  async getStatus() {
    return pick(packageJSON, ["version"]);
  }

  @Get("/error")
  async getError() {
    throw new Error("My first Sentry error!");
  }
}
