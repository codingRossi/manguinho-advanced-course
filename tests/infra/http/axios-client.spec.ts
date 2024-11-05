import { HttpGetClient } from "@/infra/http"
import axios from 'axios'

jest.mock('axios')

class AxiosHttpClient {
    async get(args: HttpGetClient.Params): Promise<any> {
        const result = await axios.get(args.url, { params: args.params })
        return result.data
    }
}

describe('AxiosHttpClient', () => {
    let sut: AxiosHttpClient;
    let fakeAxios: jest.Mocked<typeof axios>
    let url: string
    let params: object

    beforeAll(() => {
        url = 'any_url'
        fakeAxios = axios as jest.Mocked<typeof axios>
        params = { any: 'any' }
        fakeAxios.get.mockResolvedValue({
            status: 200,
            data: 'any_data',
            config: {url},
            headers: {},
            statusText: ''
            
        })
    })

    beforeEach(() => {
        sut = new AxiosHttpClient();
    })
    describe('GET', () => {
        it('Should call get with correct params', async () => {
            await sut.get({url, params })

            expect(fakeAxios.get).toHaveBeenCalledWith(url, { params: params })
            expect(fakeAxios.get).toHaveBeenCalledTimes(1)
        })

        it('Should return data on success', async () => {
            const result = await sut.get({url, params })

            expect(result).toEqual('any_data')
        })

        it('Should rethrow if get throws', async () => {
            fakeAxios.get.mockRejectedValueOnce(new Error('http_error'))
            const promise = sut.get({url, params })

            expect(promise).rejects.toThrow(new Error('http_error'))
        })
    })
})
