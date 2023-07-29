import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AppController } from "./app.controller";

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [AppController],
})
export class AppModule {}
