/*
OWNER SPECIFIC BUSINESS LOGIC
*/

var
  owner_dal = require('./owner_dal'),
  common = require("../../common"),
  env = require('node-env-file')
  ;

env('./envVars.txt');
var microdb = require('microdb-api')(process.env.MICRODB_APIKEY);

exports.getByAccountId = getByAccountId;
exports.saveProfile = saveProfile;
exports.saveDocument = saveDocument;
exports.getDocs = getDocs;
exports.getFile = getFile;
exports.getAll = getAll;
exports.addOwner = addOwner;

function getByAccountId(id) {
  return owner_dal.getByAccountId(id);
}


function saveProfile(data) {
  return owner_dal.saveProfile(data);
}

function saveDocument(data) {
  return owner_dal.saveDocument(data);
}

function getDocs(data) {
  return owner_dal.getDocs(data);
}

function getFile(data) {
  return new Promise(function (resolve) {
    var response = new common.response();
    if (!data || (data && !data.thefile)) {
      response.success = false;
      resolve(response);
    }
    else {
      owner_dal.getFile(data).then(function (getres) {
        response.success = true;
        if (getres.success) {
          response.success = true;
          response.data = getres.data;
        }
        else {
          response.success = false;
        }
        resolve(response);
      });
    }
  });
}

function getAll() {
  //check your business rules is current user can perform action
  return owner_dal.getAll();
}

function addOwner(data) {
  return new Promise(function (resolve) {
    var response = new common.response();
    if (!data.Profile.name) {
      response.success = false;
      response.message = 'Owner name is required';
      resolve(response);
    }
    else {
      //check if owner exists
      microdb.Tables.owner.get(data.Profile).then(function (res) {
        if (res.success) {
          if (res.data && res.data.Rows.length > 0) {
            response.success = false;
            response.message = 'Owner exists';
            resolve(response);
          }
          else {
            owner_dal.addOwner(data).then(resolve);
          }
        }
        else {
          // var err = res.error;
          response.success = false;
          response.message = 'error';
          resolve(response);
        }
      });

    }
  });

}