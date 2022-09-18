const crypto = require("crypto")

const cryptoHash = (...inputs) => {

    // create the hash
    const hash = crypto.createHash("sha256")

    // update the hash with the inputs - sorted so all input order does not matter
    // turn inner items in stringify forms
    // if an object's properties have changed, its stringified form represent those changes
    // stringify because one of the inputs could be an object and if the object changes JS is going to treat it as 
    // an identical piece of information so the hash will be the same
    hash.update(inputs.map((input) => JSON.stringify(input)).sort().join(" "))

    // get the result or digest of a hash
    return hash.digest("hex")
}

module.exports = cryptoHash