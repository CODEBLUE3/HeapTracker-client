// const codeParser = require("./codeParser");

import { getMemoryTrackingCode, getPositionCodeInfo } from "./codeParser.js";

const usercode = `function challenge(N, A, B) {
  var problem = new Array(N);
  const result = [0, 0, 0];
  const myobj = {
  	abc: 123,
    def: 456,
    ghi: 789,
  }

  for (let i = 0; i < B.length; i += 1) {
    if (problem[B[i] - 1]) {
      problem[B[i] - 1].push("B");
    } else {
      problem[B[i] - 1] = [];
      problem[B[i] - 1].push("B");
    }
  }

  let i = 0;
  while (i++ < 10) {
    console.log("while test");
  }

  const newArray = problem.map((item, index) => {
    return item += index;
  });

  switch (kind) {
    case "const":
    case "var":
      modicode = insertCodeEndPosition(modicode, node.end + 1);
      break;
  }

  let kind = "asdf";

  return result;
}`;

const mycode = getMemoryTrackingCode(usercode);
console.log("mycode", mycode);

const codeinfo = getPositionCodeInfo(usercode, 362);
console.log("codeinfo", codeinfo);
