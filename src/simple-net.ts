import { Net } from './interface';

export class SimpleNet implements Net {
    public async http(method: 'GET' | 'POST', path: string, params?: Net.Params): Promise<any> {
        return window.flutter_webview_post('Net', method, path, params)
    }

}
