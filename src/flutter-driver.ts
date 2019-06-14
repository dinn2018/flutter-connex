import '@vechain/connex-framework'

declare global {
    interface Window {
        flutter_inappbrowser: {
            callHandler(...args: any): any
        }
    }
}

export class FlutterDriver implements Connex.Driver {

    public readonly genesis: Connex.Thor.Block = {
        id: 'string',
        number: 0,
        size: 0,
        parentID: 'string',
        timestamp: 0,
        gasLimit: 10,
        beneficiary: 'string',
        gasUsed: 0,
        totalScore: 0,
        txsRoot: 'string',
        txsFeatures: 0,
        stateRoot: 'string',
        receiptsRoot: 'string',
        signer: 'string',
        transactions: [],
        isTrunk: true
    }
    public readonly head: Connex.Thor.Status['head'] = {
        id: 'string',
        number: 0,
        parentID: 'string',
        timestamp: 0
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

    public async signTx(
        msg: Connex.Vendor.SigningService.TxMessage,
        options: {
            delegated?: boolean,
            signer?: string,
            gas?: number,
            dependsOn?: string,
            link?: string,
            comment?: string
        }
    ): Promise<{
        unsignedTx?: {
            raw: string,
            origin: string
        },
        doSign(delegatorSignature?: string): Promise<Connex.Vendor.SigningService.TxResponse>
    }> {
        // tslint:disable-next-line:max-line-length
        if (!options.delegated) {
            // tslint:disable-next-line:max-line-length
            return { doSign: () => window.flutter_inappbrowser.callHandler('Vendor', 'signTx', msg, options) }
        }
        // TODO delegate sign tx
        // tslint:disable-next-line:max-line-length
        return { doSign: (delegatorSignature?: string) => window.flutter_inappbrowser.callHandler('Connex', 'signTx', msg, options) }

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
        return window.flutter_inappbrowser.callHandler('Connex', 'isAddressOwned', addr)
    }

}
