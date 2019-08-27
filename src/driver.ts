import '@vechain/connex-framework'
import { Net } from './interface'
declare global {
    interface Window {
        flutter_webview_post: (...args: any) => Promise<any>
    }
}

export class Driver implements Connex.Driver {
    genesis: Connex.Thor.Block
    head: Connex.Thor.Status['head']
    private net: Net
    constructor(
        net: Net,
        genesis: Connex.Thor.Block,
        initialHead: Connex.Thor.Status['head'],
    ) {
        this.net = net;
        this.genesis = genesis;
        this.head = initialHead;
    }

    public async pollHead(): Promise<Connex.Thor.Status['head']> {
        this.head = await window.flutter_webview_post('Head');
        return this.head;
    }

    public async getBlock(revision: string | number): Promise<Connex.Thor.Block | null> {
        return this.httpGet(`blocks/${revision}`)
    }
    public async getTransaction(id: string): Promise<Connex.Thor.Transaction | null> {
        return this.httpGet(`transactions/${id}`, { head: this.head.id })
    }
    public async getReceipt(id: string): Promise<Connex.Thor.Receipt | null> {
        return this.httpGet(`transactions/${id}/receipt`, { head: this.head.id })
    }

    public async getAccount(addr: string, revision: string): Promise<Connex.Thor.Account> {
        return this.httpGet(`accounts/${addr}`, { revision })
    }

    public getCode(addr: string, revision: string): Promise<Connex.Thor.Code> {
        return this.httpGet(`accounts/${addr}/code`, { revision })
    }
    public getStorage(addr: string, key: string, revision: string): Promise<Connex.Thor.Storage> {
        return this.httpGet(`accounts/${addr}/storage/${key}`, { revision })
    }
    public explain(arg: Connex.Driver.ExplainArg, revision: string, cacheTies?: string[]): Promise<Connex.Thor.VMOutput[]> {
        return this.httpPost('accounts/*', arg, { revision })
    }
    public filterEventLogs(arg: Connex.Driver.FilterEventLogsArg): Promise<Connex.Thor.Event[]> {
        return this.httpPost('logs/event', arg)
    }
    public filterTransferLogs(arg: Connex.Driver.FilterTransferLogsArg): Promise<Connex.Thor.Transfer[]> {
        return this.httpPost('logs/transfer', arg)
    }

    protected httpGet(path: string, query?: object) {
        return this.net.http('GET', path, {
            query,
            headers: { 'x-genesis-id': this.genesis.id }
        })
    }

    protected httpPost(path: string, body: any, query?: object) {
        return this.net.http('POST', path, {
            query,
            headers: { 'x-genesis-id': this.genesis.id },
            body
        })
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
        if (!options.delegateHandler) {
            return window.flutter_webview_post('Vendor', 'signTx', msg, options)
        }
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
        return window.flutter_webview_post('Vendor', 'owned', addr);
    }

}
