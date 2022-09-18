const redis = require("redis")

const CHANNELS = {
    TEST:"TEST"
}

class PubSub {
    constructor() {
        // create publisher and subscriber - play both roles
        this.publisher = redis.createClient()
        this.subscriber = redis.createClient()

        // create the subscribe channel
        this.subscribeToChannels();

        // handle messages by using a callback to subscriber that will fire whenever a msg is a received
        this.subscriber.on("message", (channel, message) => {
            this.handleMessage(channel, message)
        })
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel ${channel}. Message ${message}`);
    }

    subscribeToChannels() {
        Object.values(CHANNELS).forEach(channel => {
          this.subscriber.subscribe(channel);
        });
      }

      publish({ channel, message }) {
        this.subscriber.unsubscribe(channel, () => {
          this.publisher.publish(channel, message, () => {
            this.subscriber.subscribe(channel);
          });
        });
      }
}

const testPubSub = new PubSub()

testPubSub.publisher.publish(CHANNELS.TEST, "Heyyyyyyyyy")