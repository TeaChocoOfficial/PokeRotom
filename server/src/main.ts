//-Path: "PokeRotom/server/src/main.ts"
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import cookieParserSDK from 'cookie-parser';
import { SwaggerTheme } from 'swagger-themes';
import { SecureService } from './secure/secure.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerThemeNameEnum } from 'swagger-themes/build/enums';

async function bootstrap() {
    const time = Date.now();
    const app = await NestFactory.create(AppModule);
    const secureService = app.get(SecureService);
    const { SERVER_HOST, SERVER_PORT, CLIENT_URL, MONGODB_URI } =
        secureService.getEnvConfig();

    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParserSDK());
    app.enableCors({
        origin: CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        credentials: true,
    });

    if (secureService.isDev()) {
        const theme = new SwaggerTheme();
        const themeKeys = Object.keys(SwaggerThemeNameEnum);
        const config = new DocumentBuilder()
            .setTitle('PokeRotom Server Rest API')
            .setDescription(
                'Rest API for PokeRotom Projects. have many theme support. have /api-classic, /api-dark-monokai, /api-dark, /api-dracula, /api-feeling-blue, /api-flattop, /api-gruvbox, /api-material, /api-monokai, /api-muted, /api-newspaper, /api-nord-dark, /api-one-dark, /api-outline',
            )
            .setVersion('0.0.1')
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document, {
            explorer: true,
            swaggerOptions: {
                authAction: {
                    defaultBearerAuth: {
                        name: 'defaultBearerAuth',
                        schema: {
                            type: 'http',
                            scheme: 'basic',
                        },
                        value: 'Basic <base64_encoded_credentials>',
                    },
                },
            },
        });
        themeKeys.forEach((key) => {
            SwaggerModule.setup(
                `api-${key.toLocaleLowerCase()}`,
                app,
                document,
                {
                    explorer: true,
                    customCss: theme.getBuffer(SwaggerThemeNameEnum[key]),
                },
            );
        });
    }

    await app.listen(SERVER_PORT ?? 10000, SERVER_HOST ?? '0.0.0.0');

    Logger.debug(
        `🚀 Server is running on: ${await app.getUrl()} in ${Date.now() - time}ms`,
    );
    Logger.debug(`📄 API Docs: ${await app.getUrl()}/api`);
    Logger.debug(`🌐 Client Origin: ${CLIENT_URL}`);
    Logger.debug(`📦 MongoDB URI configured: ${MONGODB_URI ? 'Yes' : 'No'}`);
}
bootstrap();
