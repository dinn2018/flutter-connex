import { Driver } from './driver';
import { SimpleNet } from './simple-net';
import { Framework } from '@vechain/connex-framework'

function createConnex() {
    let simpleNet = new SimpleNet(window.baseURL)
    let driver = new Driver(simpleNet, window.genesis, window.initialHead)
    Object.defineProperty(window, 'connex', { value: new Framework(driver), enumerable: true });
    delete window.baseURL;
    delete window.genesis;
    delete window.initialHead;
}
createConnex();

declare global {
    interface Window {
        baseURL: string
        genesis: Connex.Thor.Block
        initialWallets: string[]
        initialHead?: Connex.Thor.Status['head']

        hasOwnProperty: (args: any) => boolean
    }
}
