
import * as CryptoJS from 'crypto-js';

export class cryptoOJ{

    constructor(){}

    encrypt(passPhrase,plainText){
        var key = this.generateKey(passPhrase);
        var iv=CryptoJS.MD5(passPhrase).toString();

        var encrypted = CryptoJS.AES.encrypt(
            plainText,
            key,
            { iv: CryptoJS.enc.Hex.parse(iv) });
        return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    }


    decrypt(passPhrase,cipherText) {
        var key = this.generateKey(passPhrase);
        var iv=CryptoJS.MD5(passPhrase).toString();
        var cipherParams = CryptoJS.lib.CipherParams.create({
          ciphertext: CryptoJS.enc.Base64.parse(cipherText)
        });
        var decrypted = CryptoJS.AES.decrypt(
            cipherParams,
            key,
            { iv: CryptoJS.enc.Hex.parse(iv) });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    generateKey(passPhrase){
        var keySize=128/32;
        var hashphrase=CryptoJS.SHA1(passPhrase).toString();
        var salt=CryptoJS.SHA256(passPhrase).toString();
        var iterationCount=passPhrase.length;

        var key = CryptoJS.PBKDF2(
            hashphrase, 
            CryptoJS.enc.Hex.parse(salt),
            { keySize: keySize, iterations: iterationCount });
        return key;
    }


    sha256(text) {
        return CryptoJS.SHA256(text).toString();
    }

}