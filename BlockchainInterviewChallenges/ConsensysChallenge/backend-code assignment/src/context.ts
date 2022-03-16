import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/AppModule'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import config from './config'
import { INestApplication } from '@nestjs/common'

import { Logger } from '@nestjs/common'

let context: INestApplication = null
export const ApplicationContext = async () => {
  if (!context) {
    context = await NestFactory.create(AppModule, {
      logger: new Logger('swagger'),
      cors: true,
    })
    const options = new DocumentBuilder()
      .setTitle('Jupiter custody')
      .setDescription('Jupiter custody API')
      .setVersion('v0.1.0')
      .setContact(
        'ConsenSys Codefi',
        'https://codefi.consensys.net',
        'mmi@consensys.net',
      )
      .addServer(
        `http://localhost:${config().serverPort}/`,
        "Codefi's Example Server",
      )
      .build()
    const document = SwaggerModule.createDocument(context, options)
    SwaggerModule.setup('docs', context, document)
    return context
  }
}
