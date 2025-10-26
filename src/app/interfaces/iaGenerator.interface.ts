/* eslint-disable @typescript-eslint/consistent-type-definitions */
export interface IAGeneratorResponse {
  code: number;
  message: string;
  result: IaGeneratorResponseResult;
}

export interface IaGeneratorResponseResult {
  data: Data;
}

export interface Data {
  prompt_id: string;
  queue_info: QueueInfo;
  results: ResultElement[];
}

export interface QueueInfo {
  status: string;
  index: number;
  prompt_status: string;
}

export interface ResultElement {
  index: number;
  nsfw: boolean;
  origin: string;
  thumb: string;
}
export interface ResultElementImage {
  indexImage: number;
  nsfwImage: boolean;
  originImage: string;
  thumbImage: string;
}

export interface GeneratorRequest {
  prompt: string;
  style_id: number;
  size: string;
}
