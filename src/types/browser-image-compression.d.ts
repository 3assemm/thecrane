declare module 'browser-image-compression' {
  interface Options {
    maxSizeMB: number;
    maxWidthOrHeight: number;
    useWebWorker?: boolean;
    preserveExif?: boolean;
  }

  function imageCompression(file: File, options: Options): Promise<File>;
  export default imageCompression;
}
