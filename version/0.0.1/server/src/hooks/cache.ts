//-Path: "motiva/server/src/hooks/cache.ts"
import { CacheModule } from '@nestjs/cache-manager';
import { SecureService } from 'src/secure/secure.service';

export function importCache() {
    return CacheModule.registerAsync({
        inject: [SecureService],
        useFactory: async (secureService: SecureService) => ({
            max: 100,
            ttl: 5 * 60,
        }),
    });
}
