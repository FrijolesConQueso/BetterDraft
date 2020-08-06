export default class Exception extends Error {
  public readonly name: string;
  public readonly namespace: ExceptionNamespace;
  public readonly code: number;

  constructor(name: string, code: number, namespace: ExceptionNamespace, message: string) {
    super(message);
    this.name = name;
    this.code = code;
    this.namespace = namespace;
  }
}

export enum ExceptionNamespace {
  DRAFT = 'DRAFT',
}
