import { S3BucketDAO } from "../interfaces/S3BucketDAO";
import { BUCKET, REGION } from "../AWSConfig"
import { ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { DAOImplementation } from "./DAOImplementation";

const client = new S3Client({ region: REGION })
export class S3BucketDAOImplementation extends DAOImplementation implements S3BucketDAO {
    async createImageReference(userImageBytes: string, alias: string, imageFileExtention: string): Promise<string> {
        return await this.doAWSOperation(async () => {
            const fileName = alias.slice(1) + imageFileExtention
            const decodedImageBuffer: Buffer = Buffer.from(userImageBytes, "base64")
            const s3Params = {
                Bucket: BUCKET,
                Key: "image/" + fileName,
                Body: decodedImageBuffer,
                ACL: ObjectCannedACL.public_read,
            }
    
            const c = new PutObjectCommand(s3Params)
            
            await client.send(c)
            const imagePath: string =  `https://${ BUCKET }.s3.${ REGION }.amazonaws.com/image/${ fileName }`
            console.log("Image saved to path: ", imagePath)
            return imagePath
        }, "S3 put image")
    }
}