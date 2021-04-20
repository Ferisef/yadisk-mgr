interface IUploadTargetProvider {
  get(savePath: string): Promise<string>;
}

export default IUploadTargetProvider;
