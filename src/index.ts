import { Driver } from './driver';
import { SimpleNet } from './simple-net';
import { Framework } from '@vechain/connex-framework'
const { getMetadata } = require('page-metadata-parser');
// set connex
let simpleNet = new SimpleNet()
let initialHead = prompt('flutter_webview') as string;
let driver = new Driver(simpleNet, window.genesis, JSON.parse(initialHead));
Object.defineProperty(window, 'connex', { value: new Framework(driver), enumerable: true });
delete window.genesis;

//get meta
Object.defineProperty(window, '__getMetaData__', {
    value: function () {
        return getMetadata(document, document.URL)
    }
});

declare global {
    interface Window {
        baseURL: string
        genesis: Connex.Thor.Block
        initialHead: Connex.Thor.Status['head']
        __NightMode__: any

    }
}
