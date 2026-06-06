const { DateTime } = require('luxon');

//@param null
//@result DateTime.now()
function nowVN() {
  return DateTime.now()
    .setZone('Asia/Ho_Chi_Minh')
    .toFormat('yyyy-MM-dd HH:mm:ss');
}

module.exports = { nowVN };
