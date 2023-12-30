import {APIBase} from './base/APIBase.tsx';
import {APIConfig} from './base/conf.tsx';

export class APIDevice extends APIBase {

    constructor(base: any) {
        super(base);
    }

    public test(): Promise<string> {
        return this.get<string>('/test')
            .then((response) => {
                const {data} = response;
                return data?.data;
            })
            .catch((error) => {
                throw error;
            });
    }
}

export default new APIDevice(APIConfig);

