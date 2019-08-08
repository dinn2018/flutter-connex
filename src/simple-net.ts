import { Net } from '@vechain/connex.driver-nodejs';

export class SimpleNet implements Net {
    constructor(readonly baseURL: string
    ) {
    }
    public async http(method: 'GET' | 'POST', path: string, params?: Net.Params): Promise<any> {
        return window.Net(method, this.baseURL + '/' + path, params)
    }
    public openWebSocketReader(path: string): Net.WebSocketReader {
        throw new Error('method not implemented')
    }
}
declare global {
    interface Window {
        Net: (...args: any) => Promise<any>
    }
}