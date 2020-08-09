const AWS = require('aws-sdk');
const { promisify }  = require('util')

class Uploader {
    constructor (id, secret, bucket) {
        this.id = id;
        this.secret = secret;
        this.bucket = bucket;
        this.s3 = new AWS.S3({
            accessKeyId: id,
            secretAccessKey: secret
        })
    }    

    async send (filename, buffer) {
        const params = {
            Bucket: this.bucket,
            Key: filename,
            Body: buffer,
            ACL: 'public-read'
        }
        const uploadPromisified = promisify(this.s3.upload)                                
        
        try {                             
             return await uploadPromisified(params)             
        } catch (err) {
            throw err
        }                 
    }
}

module.exports = Uploader;