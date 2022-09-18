const PubNub = require('pubnub');

const credentials = {
  publishKey: process.env.PUBLISH_KEY ,
  subscribeKey: process.env.SUBSCRIBE_KEY,
  secretKey: process.env.SECRET_KEY
};

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION'
};

class PubSub {
    constructor({ blockchain,
         transactionPool, 
        wallet 
        }) {
      this.blockchain = blockchain;
      this.transactionPool = transactionPool;
      this.wallet = wallet;
  
      this.pubnub = new PubNub(credentials);
  
      this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
  
      this.pubnub.addListener(this.listener());
    }
  
    broadcastChain() {
      this.publish({
        channel: CHANNELS.BLOCKCHAIN,
        message: JSON.stringify(this.blockchain.chain)
      });
    }
  
    broadcastTransaction(transaction) {
      this.publish({
        channel: CHANNELS.TRANSACTION,
        message: JSON.stringify(transaction)
      });
    }
  
    subscribeToChannels() {
      this.pubnub.subscribe({
        channels: [Object.values(CHANNELS)]
      });
    }
  
    listener() {
      return {
        message: messageObject => {
          const { channel, message } = messageObject;
  
          console.log(`Message received. Channel: ${channel}. Message: ${message}`);

          // get the original message
          const parsedMessage = JSON.parse(message);
  
          switch(channel) {
            case CHANNELS.BLOCKCHAIN:
              // replace chain if the message broadcasts a valid chain and clear mempool
              this.blockchain.replaceChain(parsedMessage, true, () => {
                this.transactionPool.clearBlockchainTransactions(
                  { chain: parsedMessage }
                );
              });
              break;
            case CHANNELS.TRANSACTION:
              // if the wallet does not exist in the transaction pool
              if (!this.transactionPool.existingTransaction({
                inputAddress: this.wallet.publicKey
              })) {
                // set transaction in transaction pool
                this.transactionPool.setTransaction(parsedMessage);
              }
              break;
            default:
              return;
          }
        }
      }
    }
  
    publish({ channel, message }) {
      // there is an unsubscribe function in pubnub
      // but it doesn't have a callback that fires after success
      // therefore, redundant publishes to the same local subscriber will be accepted as noisy no-ops
      this.pubnub.publish({ message, channel });
    }
  
    broadcastChain() {
      this.publish({
        channel: CHANNELS.BLOCKCHAIN,
        message: JSON.stringify(this.blockchain.chain)
      });
    }
  
    broadcastTransaction(transaction) {
      this.publish({
        channel: CHANNELS.TRANSACTION,
        message: JSON.stringify(transaction)
      });
    }
}
  
module.exports = PubSub;