export interface S3BucketDAO {
    createImageReference(userImageBytes: string, fileName: string): Promise<string>
}