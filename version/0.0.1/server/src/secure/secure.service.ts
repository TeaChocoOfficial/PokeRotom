//-Path: "PokeRotom/server/src/secure/secure.service.ts"
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig, envConfigs } from './dto/secure.dto';

@Injectable()
export class SecureService {
    constructor(private readonly configService: ConfigService) {}

    isDev = () => this.getEnvConfig().VITE_MODE === 'development';

    getEnvConfig = (): EnvConfig =>
        envConfigs.reduce(
            (acc, key) => ({
                ...acc,
                [key]: this.configService.get<string>(key),
            }),
            {},
        );
}
