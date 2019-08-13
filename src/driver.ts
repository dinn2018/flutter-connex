import '@vechain/connex-framework'
import { DriverNoVendor } from '@vechain/connex.driver-nodejs/dist/driver-no-vendor';
import { Net } from '@vechain/connex.driver-nodejs';

declare global {
    interface Window {
        flutter_webview_post: (...args: any) => Promise<any>
    }
}

export class Driver extends DriverNoVendor implements Connex.Driver {
    constructor(
        net: Net,
        genesis: Connex.Thor.Block,
        initialHead?: Connex.Thor.Status['head'],
    ) {
        super(net, genesis, initialHead)
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
    public async isAddressOwned(addr: string): Promise<boolean> {
        return window.flutter_webview_post('Vendor', 'wallets', addr);
    }

}
