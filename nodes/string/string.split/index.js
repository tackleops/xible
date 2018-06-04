'use strict';

module.exports = (NODE) => {
  const strsIn = NODE.getInputByName('strings');
  const strsOut = NODE.getOutputByName('strings');
  strsOut.on('trigger', async (conn, state) => {
    const strs = await strsIn.getValues(state);
    return [].concat(...strs.map(str => str.split(NODE.data.seperator)));
  });
};
