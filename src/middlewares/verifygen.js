function generateVerify() {
  const newCodeGen = Date.now() / (Math.random() * 100);
  const code = parseInt(newCodeGen.toString().split(".")[1]);
  return code
}
module.exports = {
  generateVerify,
};
