//-Path: "PokeRotom/server/src/hooks/mongodb.ts"
import { SecureService } from '../secure/secure.service';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';

export const nameDB = 'pokerotom';

export class ImportsMongoose {
    dbName?: string = nameDB;
    private models: ModelDefinition[];
    constructor(...models: ModelDefinition[]) {
        this.models = models;
    }
    setName(name: string) {
        this.dbName = name;
        return this;
    }
    get imports() {
        return [
            MongooseModule.forRootAsync({
                connectionName: this.dbName,
                inject: [SecureService],
                useFactory: async (secureService: SecureService) => ({
                    retryDelay: 3000,
                    retryAttempts: 3,
                    // MongoDB Atlas settings
                    ssl: true,
                    tlsAllowInvalidCertificates: false,
                    // Production optimizations
                    minPoolSize: 2,
                    maxPoolSize: 10,
                    socketTimeoutMS: 45000,
                    connectTimeoutMS: 10000,

                    dbName: this.dbName,
                    uri: secureService.getEnvConfig().MONGODB_URI,
                }),
            }),
            MongooseModule.forFeature(this.models, this.dbName),
        ];
    }
}
