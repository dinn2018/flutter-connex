import '@vechain/connex-framework'

declare global {
    interface Window {
        block_head: Connex.Thor.Status['head']
        genesis: Connex.Thor.Block
        wallets: Array<String>
        flutter_inappbrowser: {
            callHandler(...args: any): Promise<any>
        }
    }
}

export class FlutterDriver implements Connex.Driver {
    get genesis(): Connex.Thor.Block {
        return { ...window.genesis };
    }
    getHead() {
        return { ...window.block_head };
    }
    public async getBlock(revision: string | number): Promise<Connex.Thor.Block> {
        return window.flutter_inappbrowser.callHandler('Thor', 'getBlock', revision)
    }
    public async getTransaction(id: string, head: string): Promise<Connex.Thor.Transaction | null> {
        return window.flutter_inappbrowser.callHandler('Thor', 'getTransaction', id, head)
    }
    public async getReceipt(id: string, head: string): Promise<Connex.Thor.Receipt | null> {
        return window.flutter_inappbrowser.callHandler('Thor', 'getReceipt', id, head)
    }

    public async getAccount(addr: string, revision: string): Promise<Connex.Thor.Account> {
        return window.flutter_inappbrowser.callHandler('Thor', 'getAccount', addr, revision)
    }

    public async getCode(addr: string, revision: string): Promise<Connex.Thor.Code> {
        return window.flutter_inappbrowser.callHandler('Thor', 'getCode', addr, revision)
    }

    public async getStorage(addr: string, key: string, revision: string): Promise<Connex.Thor.Storage> {
        return window.flutter_inappbrowser.callHandler('Thor', 'getStorage', addr, key, revision)
    }
    public async explain(
        arg: {
            clauses: Connex.Thor.Clause[],
            caller?: string
            gas?: number
            gasPrice?: string
        },
        revision: string,
        cacheTies?: string[]
    ): Promise<Connex.Thor.VMOutput[]> {
        return window.flutter_inappbrowser.callHandler('Thor', 'explain', arg, revision, cacheTies)
    }
    public async filterEventLogs(
        arg: {
            range: Connex.Thor.Filter.Range
            options: {
                offset: number,
                limit: number
            }
            criteriaSet: Connex.Thor.Event.Criteria[]
            order: 'asc' | 'desc'
        }
    ): Promise<Connex.Thor.Event[]> {
        return window.flutter_inappbrowser.callHandler('Thor', 'filterEventLogs', arg)
    }

    public async filterTransferLogs(
        arg: {
            range: Connex.Thor.Filter.Range,
            options: {
                offset: number,
                limit: number
            }
            criteriaSet: Connex.Thor.Transfer.Criteria[],
            order: 'asc' | 'desc'
        }
    ): Promise<Connex.Thor.Transfer[]> {
        return window.flutter_inappbrowser.callHandler('Thor', 'filterTransferLogs', arg)
    }

    public async signTx(msg: Connex.Vendor.SigningService.TxMessage, options: {
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
    }): Promise<Connex.Vendor.SigningService.TxResponse> {
        // tslint:disable-next-line:max-line-length
        if (!options.delegateHandler) {
            // tslint:disable-next-line:max-line-length
            return window.flutter_inappbrowser.callHandler('Vendor', 'signTx', msg, options)
        }
        // TODO delegate sign tx
        // tslint:disable-next-line:max-line-length
        throw new Error('unsupported now')
    }
    public async signCert(
        msg: Connex.Vendor.SigningService.CertMessage,
        options: {
            signer?: string
            link?: string
        }
    ): Promise<Connex.Vendor.SigningService.CertResponse> {
        return window.flutter_inappbrowser.callHandler('Vendor', 'signCert', msg, options)
    }

    public isAddressOwned(addr: string) {
        return window.wallets.includes(addr);
    }

}
