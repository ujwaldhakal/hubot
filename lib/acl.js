let _ = require('lodash');
let config = require('./config');
let superagent = require('superagent');
let tsv = require('tsv').TSV;

let acl = {};

function addPagevampEmail(users) {
  return users.split(',').map(user => {
    return `${user.trim()}@pagevamp.com`;
  })
}

function loadAcl(aclConfig) {
  if (_.isObject(aclConfig)) {
    acl = aclConfig;
    return;
  }
  console.log('loading acl config');
  return superagent.get(config.get('aclSheet.url')).then((res) => {
    let rows = tsv.parse(res.text);
    rows.filter(row => row.app && row.staging && row.production).map(row => {
      acl[row.app] = {};
      acl[row.app].staging = addPagevampEmail(row.staging);
      acl[row.app].production = addPagevampEmail(row.production);
    });    
  });
}
loadAcl();
setInterval(loadAcl, config.get('aclSheet.refresh'));

function isAllowedToDeploy(appName, userEmail, environment) {
  let allowedUsers = _.get(acl, `${appName}.${environment}`);

  if(allowedUsers && allowedUsers.includes('all@pagevamp.com')) {
    return true;
  }

  return allowedUsers && allowedUsers.includes(userEmail);
}

module.exports = {
  loadAcl,
  isAllowedToDeploy
}
