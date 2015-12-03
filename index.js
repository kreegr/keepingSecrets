#! /usr/bin/env node

var crypto = require('crypto-js');
var fs = require('fs');
var path = require('path');
var words = require('./words');
//var filePath = path.resolve(__dirname, '.', 'words.json');
var WORDS_FILE_PATH = '~/.keeping_secrets';
var _ = require('lodash-node/underscore');
var generatePassword = require('password-generator');
var read = require('read');
var exec = require('child_process').exec;

var encrypt = function encrypt(){
    var label, message, secret;
    if (arguments[0]==="-g"){
        label = arguments[1];
        message = generatePassword(18, false);
    } else {
        label = arguments[0];
        message = arguments[1];
    }

    read({
        prompt : 'Secret:',
        silent: true
    }, function(err, secret){
        if (err){
            console.log('Error %s', err);
            return;
        }

        var encrypted = crypto.Rabbit.encrypt(message, secret);
        words[label] = "" + encrypted;
        var newWords = JSON.stringify(words, null, 2);
        fs.writeFileSync(WORDS_FILE_PATH, newWords);
        console.log('words updated with %s', label);
        console.log(message);
        finish(message);
    });


};

var decrypt = function decrypt(label){
    var message = words[label];
    read({
        prompt: 'Secret:',
        silent: true
    }, function(err, secret){
        var decrypted = crypto.Rabbit.decrypt(message, secret);
        var out = decrypted.toString(crypto.enc.Utf8);
        finish(out);
    });
};

var finish = function finish(out){
    exec('printf "' + out + '" | pbcopy', function(){console.log('done')});
    exec("history -c");
};

var len = process.argv.length;
var ENCRYPT_ARGS_LEN = 4;
var DECRYPT_ARGS_LEN = 3;
var args;
if (len === ENCRYPT_ARGS_LEN){
    args = [].concat(process.argv).splice(2-ENCRYPT_ARGS_LEN);
    encrypt.apply(this, args);
} else if (len === DECRYPT_ARGS_LEN){
    args = [].concat(process.argv).splice(2-DECRYPT_ARGS_LEN);
    decrypt.apply(this, args);
}
