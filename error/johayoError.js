
function johayoError (code, message) {
    Error.call(this, message);
    this.name = "JpvsError";
    this.message = message;
    this.code = code;
    this.status = 400;
}

johayoError.prototype = Object.create(Error.prototype);
johayoError.prototype.constructor = johayoError;

module.exports = johayoError;