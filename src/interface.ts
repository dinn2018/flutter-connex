/** Net interface supports http transport */
export interface Net {

    /**
     * perform http request
     * @param method 'GET' or 'POST'
     * @param path path to access
     * @param params additional params
     * @returns response body, JSON decoded
     */
    http(
        method: 'GET' | 'POST',
        path: string,
        params?: Net.Params
    ): Promise<any>
}

export namespace Net {
    /** http request params */
    export interface Params {
        query?: object
        body?: any // JSON encoded
        headers?: object
    }
}
