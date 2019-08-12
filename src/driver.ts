import '@vechain/connex-framework'
import { DriverNoVendor } from '@vechain/connex.driver-nodejs/dist/driver-no-vendor';
import { Net } from '@vechain/connex.driver-nodejs';

declare global {
    interface Window {
        flutter_webview_post: (...args: any) => Promise<any>
    }
}

export class Driver extends DriverNoVendor {
    private wallets: string[]
    constructor(
        net: Net,
        genesis: Connex.Thor.Block,
        initialWallets: string[],
        initialHead?: Connex.Thor.Status['head'],
    ) {
        super(net, genesis, initialHead)
        this.wallets = initialWallets
        this.syncWallets();
    }

    public async signTx(msg: Connex.Vendor.TxMessage, options: {
        signer?: string;
        gas?: number;
        dependsOn?: string;
        link?: string;
        comment?: string;
        delegateHandler?: (unsignedTx: {
            raw: string;
            origin: string;
        }) => Promise<{
            signature: string;
        }>;
    }): Promise<Connex.Vendor.TxResponse> {
        // tslint:disable-next-line:max-line-length
        if (!options.delegateHandler) {
            // tslint:disable-next-line:max-line-length
            return window.flutter_webview_post('Vendor', 'signTx', msg, options)
        }
        // TODO delegate sign tx
        // tslint:disable-next-line:max-line-length
        throw new Error('unsupported now')
    }
    public async signCert(
        msg: Connex.Vendor.CertMessage,
        options: {
            signer?: string
            link?: string
        }
    ): Promise<Connex.Vendor.CertResponse> {
        return window.flutter_webview_post('Vendor', 'signCert', msg, options)
    }
    public isAddressOwned(addr: string) {
        return this.wallets.includes(addr);
    }

    private async syncWallets() {
        for (; ;) {
            let wallets = await window.flutter_webview_post('Vendor', 'wallets');
            if (wallets.length != this.wallets.length) {
                this.wallets = wallets;
            }
        }
    }

}
