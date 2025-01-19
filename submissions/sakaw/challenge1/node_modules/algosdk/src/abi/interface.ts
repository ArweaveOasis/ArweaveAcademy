import { ABIMethod, ABIMethodParams, getMethodByName } from './method';

export interface ABIInterfaceParams {
  name: string;
  desc?: string;
  methods: ABIMethodParams[];
}

export class ABIInterface {
  public readonly name: string;
  public readonly description?: string;
  public readonly methods: ABIMethod[];

  constructor(params: ABIInterfaceParams) {
    if (typeof params.name !== 'string' || !Array.isArray(params.methods)) {
      throw new Error('Invalid ABIInterface parameters');
    }

    this.name = params.name;
    this.description = params.desc;
    this.methods = params.methods.map((method) => new ABIMethod(method));
  }

  toJSON(): ABIInterfaceParams {
    return {
      name: this.name,
      desc: this.description,
      methods: this.methods.map((method) => method.toJSON()),
    };
  }

  getMethodByName(name: string): ABIMethod {
    return getMethodByName(this.methods, name);
  }
}
