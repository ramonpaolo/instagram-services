import { S3 } from 'aws-sdk'

async function uploadAWS(s3: S3, key: string, data: Buffer) {
    const locationData: string | null = await new Promise((resolve, reject) =>
        s3.upload({
            Bucket: String(process.env.BUCKET),
            Key: key, Body: data, ACL: 'public-read'
        }, (err, data) => {
            if(err) return reject(null)
            return resolve(data.Location)
        })
    )
    return locationData;
}

async function setS3(): Promise<S3> {
    
    return new S3({
        credentials: {
            accessKeyId: String(process.env.ACCESS_KEY_ID),
            secretAccessKey: String(process.env.SECRET_ACCESS_KEY)
        }, region: String(process.env.REGION),
    })
}

export { setS3, uploadAWS }