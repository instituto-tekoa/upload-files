const AWS = require('aws-sdk');

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

        try {
            await this.s3.upload(params).promise()                        
        } catch (err) {
            throw err
        }                 
    }
}

module.exports = Uploader;