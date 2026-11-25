export type ResponseErrorData = {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  code?: string;
};

export default class extends Error {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  code?: string;

  constructor(options: ResponseErrorData) {
    super();

    this.type = options.type;
    this.title = options.title;
    this.status = options.status;
    this.detail = options.detail;
    this.code = options.code;
  }
}
