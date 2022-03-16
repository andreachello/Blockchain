import { ApplicationContext } from './context'
import config from './config'

async function startServer() {
  console.log('Started server')
  const app = await ApplicationContext()

  app.enableShutdownHooks()

  await app.listen(config().serverPort)
}

async function stopServer() {
  const app = await ApplicationContext()
  app.close()
}

export { startServer, stopServer }
