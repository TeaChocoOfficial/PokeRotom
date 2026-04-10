//-Path: "PokeRotom/server/src/app.service.ts"
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): { message: string } {
        return { message: 'Hello World!' };
    }
}
