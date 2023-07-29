import { HttpException, Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { SentryModule, SentryInterceptor } from "@travelerdev/nestjs-sentry";
import { AppController } from "./app.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";

console.log(process.env.NODE_ENV);

@Module({
  imports: [
    ConfigModule.forRoot({
      // in production, env variables should be
      // loaded via environment vars, not .env files
      ignoreEnvFile: process.env.NODE_ENV === "production",
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const NODE_ENV = configService.get("NODE_ENV");

        return {
          dsn: configService.getOrThrow("SENTRY_DSN"),
          debug: NODE_ENV !== "production",
          environment: NODE_ENV === "production" ? "production" : "dev",
          logLevels: ["debug"], //based on sentry.io loglevel
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () =>
        new SentryInterceptor({
          filters: [
            {
              type: HttpException,
              // Only report 500 errors
              filter: (exception: any) => 500 > exception.getStatus(),
            },
          ],
        }),
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
