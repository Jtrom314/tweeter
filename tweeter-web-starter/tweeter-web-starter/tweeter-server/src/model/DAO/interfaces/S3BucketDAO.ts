export interface S3BucketDAO {
    createImageReference(userImageBytes: string, alias: string, imageFileExtention: string): Promise<string>
}