import { Controller, Get } from "@nestjs/common";
import { pick } from "lodash";
import packageJSON from "../package.json";

@Controller()
export class AppController {
  @Get("/status")
  async getStatus() {
    return pick(packageJSON, ["version"]);
  }
}
