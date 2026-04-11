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
    getAllowedUrls(): string[] {
        const env = this.getEnvConfig();
        const allowedUrls = [env.CLIENT_URL ?? 'http://127.0.0.1:3000'];
        allowedUrls.push('http://192.168.1.123:8000');
        return allowedUrls;
    }
}
