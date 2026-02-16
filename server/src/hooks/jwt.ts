//-Path: "motiva/server/src/hooks/jwt.ts"
import { JwtModule } from '@nestjs/jwt';
import { SecureService } from 'src/secure/secure.service';

export function importJwt() {
    return JwtModule.registerAsync({
        inject: [SecureService],
        useFactory: async (secureService: SecureService) => ({
            secret: secureService.getEnvConfig().JWT_SECRET,
            signOptions: {
                expiresIn: secureService.getEnvConfig()
                    .JWT_REFRESH_EXPIRES_IN as `${number}`,
            },
        }),
    });
}
