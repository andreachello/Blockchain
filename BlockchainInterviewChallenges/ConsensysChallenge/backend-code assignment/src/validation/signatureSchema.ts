import * as Joi from '@hapi/joi'

export const signatureSchema = Joi.object({
  payload: Joi.object(),
  accountId: Joi.string(),
  signatureVersion: Joi.string(),
})
