
let Ajax = require("./ajax.js")

module.exports = class Commom extends Ajax {
  getPublicKey(data) {
    super.get({
      url: "b2dmao/common/public_key.jhtml",
      data: data
    })
  }
}