const { parse, parseExpressionAt } = require("acorn");

module.exports = class modifyCode {
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

      this.findNodeType(node, node.type);

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

      this.lastFindNodeType(node, node.type);
    };

    this.findNodeType = (node, type) => {
      switch (type) {
        case "ForStatement":
        case "WhileStatement":
        case "DoWhileStatement":
        case "SwitchStatement":
        case "ForOfStatement":
          this.code = this.insertCodeType(this.code, node.start, type);
          break;
        case "FunctionDeclaration":
        case "ArrowFunctionExpression":
          if (node.body) {
            this.code = this.insertCodeType(
              this.code,
              node.body.start + 1,
              type + " " + (node.id ? node.id.name : ""),
            );
          }
          break;
        case "IfStatement":
          if (node.consequent) {
            this.parseNodeObject(node.consequent);
          }
          if (node.alternate) {
            this.parseNodeObject(node.alternate);
          }
          break;
      }
    };

    this.lastFindNodeType = (node, type) => {
      switch (type) {
        case "VariableDeclarator":
          if (node.init.type === "ArrowFunctionExpression") {
            this.parseNodeObject(node.init);
          }

          this.code = this.insertCodePosition(
            this.code,
            node.end + 1,
            node.start,
          );
          break;
      }
    };

    this.insertCodePosition = (code, insertPosition, nodePosition) => {
      const trackingFunctionCode = `m(${nodePosition}, null);`;

      const modifiedCode =
        code.substring(0, insertPosition + this.insertLength) +
        trackingFunctionCode +
        code.substring(insertPosition + this.insertLength);

      this.insertLength += trackingFunctionCode.length;

      return modifiedCode;
    };

    this.insertCodeType = (code, insertPosition, nodeType) => {
      const trackingFunctionCode = `m(null, "${nodeType}");`;

      const modifiedCode =
        code.substring(0, insertPosition + this.insertLength) +
        trackingFunctionCode +
        code.substring(insertPosition + this.insertLength);

      this.insertLength += trackingFunctionCode.length;

      return modifiedCode;
    };
  }

  static modifyRun(nodes, code) {
    return new this(nodes, code).modify();
  }

  modify() {
    this.parseNodeObject(this.nodes);
    return this.code;
  }

  static getMemoryTrackingCode(code) {
    try {
      const astNodes = parse(code, { ecmaVersion: 2020 });
      return modifyCode.modifyRun(astNodes, code);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static getPositionCodeInfo(code, position) {
    try {
      return parseExpressionAt(code, position, {
        ecmaVersion: 2020,
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};
