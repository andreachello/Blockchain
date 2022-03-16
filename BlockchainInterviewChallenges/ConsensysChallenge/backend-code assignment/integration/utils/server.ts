import npm from 'npm'
import Axios from 'axios'
import axiosRetry from 'axios-retry'
import { API_BASE_URL } from './configs'
import { sleep } from '../../src/utils/utils'

const execSync = require('child_process').execSync

export const stopNodeServer = async () => {
  console.log(`Stopping node server`)
  // TODO find better way top stop and start the server
  // found some issues that we can investigate later if we need to
  await sleep(1000)
  await execSync(`pkill api-name`)
  await sleep(1000)
}

const waitForServer = async () => {
  const axiosInstance = Axios.create()
  axiosRetry(axiosInstance, {
    retries: 60,
    retryDelay: () => {
      return 1000
    },
  })
  await axiosInstance.get(API_BASE_URL)
  return
}

export const startNodeServer = async () => {
  console.log(`Starting node server`)
  return new Promise((resolve) => {
    npm.load(async () => {
      npm.run('start')
      await waitForServer()
      resolve(0)
    })
  })
}
