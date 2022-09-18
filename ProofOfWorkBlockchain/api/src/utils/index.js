const EC = require("elliptic").ec
const cryptoHash = require("./crypto-hash")

// Elliptic curve cryptography - use a prime number to generate the curve (256 bits)
const ec = new EC('secp256k1')

const verifySignature = ({publicKey, data, signature}) => {
    // get the key from the public key in hex form
    const keyFromPublic = ec.keyFromPublic(publicKey, "hex")

    // verify signature and hash the data
    return keyFromPublic.verify(cryptoHash(data), signature)
}

module.exports = { ec, verifySignature, cryptoHash}