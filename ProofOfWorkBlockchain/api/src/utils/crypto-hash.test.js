const cryptoHash = require("./crypto-hash")

describe("cryptoHash()", () => {
    it("generates a SHA-256 hashed output", () => {
        expect(cryptoHash('foo'))
            .toEqual("b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b")
    })

    it("produces the same hash with the same input arguments in any order", () => {
        expect(cryptoHash("one", "two", "three"))
            .toEqual(cryptoHash("three", "one", "two"))
    })

    // when a new object is passed
    it("produces a unique has when the properties have changed in an input", () => {

        // need to update hash
        const foo = {}
        const originalhash = cryptoHash(foo)
        foo["a"] = "a"

        expect(cryptoHash(foo)).not.toEqual(originalhash)
    })
})