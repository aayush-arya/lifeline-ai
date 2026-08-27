const crypto = require('crypto');

/** Same id shape regardless of which store is backing a request. */
function genId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

module.exports = { genId };
