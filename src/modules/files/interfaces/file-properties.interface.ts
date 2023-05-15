export interface IFileProperties {
  width: number;
  height: number;
  size: number;
  mimetype?: string;
  format: string;
}

export interface ITip4ItemJson {
  type: string;
  name: string;
  description: string;
  files: ITip4JsonFileMeta[];
  external_url: string;
}

export type ITip4JsonFileMeta = {
  source: string;
  width?: number;
  height?: number;
  size?: number;
  mimetype?: string;
  format?: string;
};