import * as Joi from '@hapi/joi'

export const transactionSchema = Joi.object({
  to: Joi.string(),
  accountId: Joi.string(),
  gasLimit: Joi.string(),
  data: Joi.string().allow(null, ''),
  value: Joi.string(),
  type: Joi.string().default('0').valid('0', '1', '2'),
  gasPrice: Joi.alternatives().conditional('type', {
    is: ['0', '1'],
    then: Joi.string().required(),
  }),
  maxFeePerGas: Joi.alternatives().conditional('type', {
    is: '2',
    then: Joi.string().required(),
  }),
  maxPriorityFeePerGas: Joi.alternatives().conditional('type', {
    is: '2',
    then: Joi.string().required(),
  }),
})
