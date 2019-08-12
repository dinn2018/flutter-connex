import { Driver } from './driver';
import { SimpleNet } from './simple-net';
import { Framework } from '@vechain/connex-framework'

function createConnex(baseURL: string,
    genesis: Connex.Thor.Block,
    initialWallets: string[],
    initialHead?: Connex.Thor.Status['head'], ) {
    let simpleNet = new SimpleNet(baseURL)
    let driver = new Driver(simpleNet, genesis, initialWallets, initialHead)
    Object.defineProperty(window, 'connex', { value: new Framework(driver), enumerable: true });
    delete window.baseURL;
    delete window.genesis;
    delete window.initialHead;
    delete window.initialWallets;
}

createConnex(window.baseURL, window.genesis, window.initialWallets, window.initialHead)


declare global {
    interface Window {
        baseURL: string
        genesis: Connex.Thor.Block
        initialWallets: string[]
        initialHead?: Connex.Thor.Status['head']

        hasOwnProperty: (args: any) => boolean
    }
}
