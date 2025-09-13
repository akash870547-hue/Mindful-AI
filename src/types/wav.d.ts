declare module 'wav' {
  import { Transform } from 'stream';

  export interface WriterOptions {
    channels?: number;
    sampleRate?: number;
    bitDepth?: number;
  }

  export class Writer extends Transform {
    constructor(options?: WriterOptions);
  }

  export interface ReaderOptions {
    [key: string]: any;
  }
  
  export class Reader extends Transform {
    constructor(options?: ReaderOptions);
    on(event: 'format', listener: (format: any) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
  }
}
