import { Net } from '@vechain/connex.driver-nodejs';

export class SimpleNet implements Net {
    constructor(readonly baseURL: string
    ) {
    }
    public async http(method: 'GET' | 'POST', path: string, params?: Net.Params): Promise<any> {
        return window.flutter_webview_post('Net', method, this.baseURL + '/' + path, params)
    }
    public openWebSocketReader(path: string): Net.WebSocketReader {
        throw new Error('method not implemented')
    }
}
