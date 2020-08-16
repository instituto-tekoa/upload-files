const AWS = require('aws-sdk');
const crypto = require('crypto');

const CRYPTO_ALGORITHM = 'aes-256-cbc';

if (!process.env.AWS_ACCESS_KEY) console.error('AWS_ACCESS_KEY not found on .env');
if (!process.env.AWS_SECRET_KEY) console.error('AWS_SECRET_KEY not found on .env');
if (!process.env.BUCKET) console.error('BUCKET not found on .env');
if (!process.env.SECRET_IV) console.error('SECRET_IV not found on .env');
if (!process.env.SECRET_KEY) console.error('SECRET_KEY not found on .env');
if (!process.env.REACT_APP_URL) console.error('REACT_APP_URL not found on.env');

const SECRET_IV = Buffer.from(process.env.SECRET_IV, 'hex');
const SECRET_KEY = Buffer.from(process.env.SECRET_KEY, 'hex');

class Uploader {
    constructor() {
        this.id = process.env.AWS_ACCESS_KEY;
        this.secret = process.env.AWS_SECRET_KEY;
        this.bucket = process.env.BUCKET;
        this.s3 = new AWS.S3({
            accessKeyId: this.id,
            secretAccessKey: this.secret,
        });
    }

    async send(path, contentType, buffer) {
        const encryptedFilename = this.encrypt(path);

        const prefix = process.env.REACT_APP_URL.includes('localhost')? "staging/": "";

        const params = {
            Bucket: this.bucket,
            Key: `${prefix}${new Date().getFullYear()}/${encryptedFilename}`,
            ContentType: contentType,
            Body: buffer,
            ACL: 'public-read',
        };

        const uploadPromise = this.s3.upload(params).promise();

        return uploadPromise;
    }

    encrypt(text) {
        const cipher = crypto.createCipheriv(
            CRYPTO_ALGORITHM,
            Buffer.from(SECRET_KEY),
            SECRET_IV
        );
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('hex');
    }

    decrypt(text) {
        const encryptedText = Buffer.from(text, 'hex');
        const decipher = crypto.createDecipheriv(
            CRYPTO_ALGORITHM,
            Buffer.from(SECRET_KEY),
            SECRET_IV
        );
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}

module.exports = Uploader;
