import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import axiosRetry from 'axios-retry'
import { EthereumAccount } from '../../src/data/entities/EthereumAccount';
import { EthereumTransaction } from '../../src/data/entities/EthereumTransaction';


const API_BASE_URL = 'http://localhost:3001';
// This is your running server

export interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request?: any;
}

const getAxiosInstance = (retryIfNotFound?: boolean): AxiosInstance => {
  const instance = Axios.create()
  if (retryIfNotFound) {
    axiosRetry(instance, {
      retries: 60,
      retryDelay: () => {
        return 1000
      },
      retryCondition: (error) => {
        return error.response.status === 404
      },
    });
  }
  return instance
}

export const getAccounts = async (retry?: boolean) : Promise<EthereumAccount[]> => {
  const instance = getAxiosInstance(retry)
  const resp = await instance.get(`${API_BASE_URL}/custodian/account`)
  return resp.data as EthereumAccount[]
}

export const getTransaction = async (id: string, retry?: boolean) : Promise<EthereumTransaction> => {
  const instance = getAxiosInstance(retry)
  const resp = await instance.get(`${API_BASE_URL}/custodian/transaction/${id}`)
  return resp.data as EthereumTransaction
}

export const updateTransaction = async (id: string, transactionStatus: string, retry?: boolean) => {
  const instance = getAxiosInstance(retry)
  const resp = await instance.patch(`${API_BASE_URL}/custodian/transaction/${id}`, { transactionStatus })

  return resp.data as EthereumTransaction
}


export const createTransaction = async (to: string, fromAccountId: string, retry?: boolean) : Promise<EthereumTransaction> => {
  const instance = getAxiosInstance(retry);

  const transaction = {
    "to" : to,
    "accountId" : fromAccountId,
    "maxFeePerGas" : "4000000013",
    "maxPriorityFeePerGas" : "4000000000",
    "gasLimit" : "33997",
    "value" : "1000000000000000",
    "data" : "",
    "type" : "2"
  }

  const tx = (await instance.post(`${API_BASE_URL}/custodian/transaction`, transaction)).data

  return tx as EthereumTransaction

}

export const deleteTransaction = async (id:string, retry?: boolean) => {
  const instance = getAxiosInstance(retry);
  await instance.delete(`${API_BASE_URL}/custodian/transaction/${id}`)
}