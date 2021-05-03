import * as AWS from 'aws-sdk';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';

import { secret_access_key, access_key_id, region } from '../config';
AWS.config.update({
    secretAccessKey: secret_access_key,
    accessKeyId: access_key_id,
    region: region
});

const s3 = new AWS.S3();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Invalid Mime Type, only JPEG and PNG"), false);
    }
};

export const upload = multer({
    fileFilter,
    storage: multerS3({
        s3,
        bucket: "testdownloadimagesbucket",
        acl: "public-read",
        metadata: (req, file, cb) => {
            cb(null, { fieldName: "TESTING_META_DATA!" });
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString());
        }
    })
});

