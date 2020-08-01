export default class Exception extends Error {
  public readonly name: string;
  public readonly namespace: string;
  public readonly code: number;

  constructor(name: string, code: number, namespace: string, message: string) {
    super(message);
    this.name = name;
    this.code = code;
    this.namespace = namespace;
  }
}
