import { parse, parseExpressionAt } from "acorn";

export function getMemoryTrackingCode(code) {
  try {
    const usercode = code;
    const astNodes = parse(usercode, { ecmaVersion: 2020 });
    const mycode = modifyCode.modifyRun(astNodes, usercode);
    return mycode;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function getPositionCodeInfo(code, pos) {
  try {
    const usercode = code;
    const astNodes = parseExpressionAt(usercode, pos, { ecmaVersion: 2020 });
    return astNodes;
  } catch (error) {
    console.error(error);
    return null;
  }
}

class modifyCode {
  constructor(nodes, code) {
    this.code = code;
    this.nodes = nodes;
    this.insertLength = 0;

    this.parseNodeArray = (arrayNode) => {
      if (!arrayNode) return;

      for (const node of arrayNode) {
        this.parseNodeObject(node);
      }
    };

    this.parseNodeObject = (node) => {
      if (!node) return;
      if (node.body) {
        if (node.body.length) {
          this.parseNodeArray(node.body);
        } else {
          this.parseNodeObject(node.body);
        }
      }

      if (node.declarations) {
        this.parseNodeArray(node.declarations);
      }

      this.controlNodeType(node, node.type);
    };

    this.insertCode = (code, position, start, end) => {
      const trackingFunctionCode = "m(" + start + ", " + end + ");";
      const modifiedCode =
        code.substring(0, position + this.insertLength) +
        trackingFunctionCode +
        code.substring(position + this.insertLength);
      this.insertLength += trackingFunctionCode.length;
      return modifiedCode;
    };

    this.controlNodeType = (node, type) => {
      // eslint-disable-next-line default-case
      switch (type) {
        case "ForStatement":
        case "WhileStatement":
        case "SwitchStatement":
          this.code = this.insertCode(
            this.code,
            node.start,
            node.start,
            node.end,
          );
          break;
        case "VariableDeclarator":
          console.log("VariableDeclarator", node.start);
          this.code = this.insertCode(
            this.code,
            node.end + 1,
            node.start,
            node.end,
          );
          break;
        case "CallExpression":
          console.log("CallExpression", node.start, node.end);
          break;
      }
    };
  }

  static modifyRun(nodes, code) {
    return new this(nodes, code).modify();
  }

  modify() {
    this.parseNodeObject(this.nodes);
    return this.code;
  }
}
