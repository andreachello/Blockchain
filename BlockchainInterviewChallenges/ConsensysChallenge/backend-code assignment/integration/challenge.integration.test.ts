import { createTransaction, getAccounts, getTransaction, updateTransaction, deleteTransaction } from './utils/requests';
require('dotenv').config()

jest.setTimeout(10000)

const transactionIdsToCleanUp = [];

describe('/custodian/account', () => {

  it('gets 3 accounts', async () => {
    const response = await getAccounts()
    expect(response.length).toEqual(3)
    expect(response[0]).toHaveProperty('address')
  })

})

describe('/custodian/transaction', () => {

  it('creates, signs and sends a transaction',  async () => {

    // Set up
    const accounts = await getAccounts();
    const accountIdToSendFrom = accounts[0].id;
    const addressToSendTo = accounts[1].address;

    // Create the transaction
    const createTxResult = await createTransaction(addressToSendTo, accountIdToSendFrom);
    expect(createTxResult.transactionStatus).toEqual('created');

    // Check if the transaction is there in the transaction API

    const getTxResult = await getTransaction(createTxResult.id);

    expect(getTxResult.id).toEqual(createTxResult.id)

    // Now sign the transaction

    const signTxResult = await updateTransaction(createTxResult.id, 'signed');

    expect(signTxResult.transactionStatus).toEqual('signed')
    expect(signTxResult.signedRawTransaction).toMatch(/^0x.*/)


    // Now submit the transaction
    // The transaction hash comes from the receipt, so we will know that it was submitted

    const submitTxResult = await updateTransaction(createTxResult.id, 'submitted');

    expect(submitTxResult.transactionStatus).toEqual('submitted')
    expect(submitTxResult.transactionHash).toMatch(/^0x.*/)

    // Don't wait for it to be mined, because it would take too long to run the test

    transactionIdsToCleanUp.push(createTxResult.id);
  })


  it('does not encounter an error if you sign two transactions',  async () => {

    // Set up
    const accounts = await getAccounts();
    const accountIdToSendFrom = accounts[0].id;
    const addressToSendTo = accounts[1].address;

    // Create the first transaction
    const createTxResult1 = await createTransaction(addressToSendTo, accountIdToSendFrom);

    // Create the second transaction
    const createTxResult2 = await createTransaction(addressToSendTo, accountIdToSendFrom);


    transactionIdsToCleanUp.push(createTxResult1.id);
    transactionIdsToCleanUp.push(createTxResult2.id);

    // Now sign the first transaction

    const signTxResult1 = await updateTransaction(createTxResult1.id, 'signed');

    // Now sign the second transaction

    const signTxResult2 = await updateTransaction(createTxResult2.id, 'signed');


    // Now submit the first transaction

    const submitTxResult1 = await updateTransaction(createTxResult1.id, 'submitted');


    // Now submit the second transaction. This is where the bug is encountered

    await updateTransaction(createTxResult2.id, 'submitted');


  })


})

afterAll( async () => {
  for (const id of transactionIdsToCleanUp) {
    console.log(`Deleting transaction ${id}`)
    await deleteTransaction(id);
  }
})