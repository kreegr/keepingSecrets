#! /usr/bin/env node

var crypto = require('crypto-js');
var fs = require('fs');
var path = require('path');
var words = require('./words');
var filePath = path.resolve('.', 'words.json');
var _ = require('lodash-node/underscore');
var generatePassword = require('password-generator');

var encrypt = function encrypt(){
    var label, message, secret;
    if (arguments[0]==="-g"){
        label = arguments[1];
        secret = arguments[2];
        message = generatePassword(18, false);
        console.log(message);
    }

    var encrypted = crypto.Rabbit.encrypt(message, secret);
    words[label] = "" + encrypted;
    var newWords = JSON.stringify(words, null, 2);
    fs.writeFileSync(filePath, newWords);
    console.log('words updated');
};

var decrypt = function decrypt(label, secret){
    var message = words[label];
    var decrypted = crypto.Rabbit.decrypt(message, secret);
    console.log("%s", decrypted.toString(crypto.enc.Utf8));
    //var exec = require('child_process').exec;
    //exec("echo " + decrypted.toString(crypto.enc.Utf8) + " | pbcopy", function(){console.log('done')});
    //exec("history -c");
};

var len = process.argv.length;
var ENCRYPT_ARGS_LEN = 5;
var DECRYPT_ARGS_LEN = 4;
var args;
if (len === ENCRYPT_ARGS_LEN){
    args = [].concat(process.argv).splice(2-ENCRYPT_ARGS_LEN);
    encrypt.apply(this, args);
} else if (len === DECRYPT_ARGS_LEN){
    args = [].concat(process.argv).splice(2-DECRYPT_ARGS_LEN);
    decrypt.apply(this, args);
}
