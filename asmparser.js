function getRegBit(x) {
  let ret = "";
  for (i = 4; i >= 0; --i) {
    if ((x & (1 << i)) > 0) {
      ret += "1";
    } else {
      ret += "0";
    }
  }
  return ret;
}
function getImmBit(x) {
  let ret = "";
  for (i = 15; i >= 0; --i) {
    if ((x & (1 << i)) > 0) {
      ret += "1";
    } else {
      ret += "0";
    }
  }
  return ret;
}
function parse(str) {
  let instrs = str.split("\n");
  let ret = [];
  for (let instr of instrs) {
    let components = instr.split(" ");
    console.log(components);
    let bitstr = "";
    if (components[0] == "add") {
      bitstr += "010001";
      let regnum1 = parseInt(components[1].slice(1, components[1].length), 10);
      let regnum2 = parseInt(components[2].slice(1, components[2].length), 10);
      bitstr += getRegBit(regnum1) + getRegBit(regnum2) + getImmBit(0);
    } else if (components[0] == "sub") {
      bitstr += "010010";
      let regnum1 = parseInt(components[1].slice(1, components[1].length), 10);
      let regnum2 = parseInt(components[2].slice(1, components[2].length), 10);
      bitstr += getRegBit(regnum1) + getRegBit(regnum2) + getImmBit(0);
    } else if (components[0] == "set") {
      bitstr += "001000";
      let regnum1 = parseInt(components[1].slice(1, components[1].length), 10);
      bitstr += getRegBit(regnum1) + getRegBit(0) + getImmBit(components[2]);
    } else if (components[0] == "sw") {
      bitstr += "011000";
      let regnum1 = parseInt(components[1].slice(1, components[1].length), 10);
      let regnum2 = parseInt(components[2].slice(1, components[2].length), 10);
      bitstr +=
        getRegBit(regnum1) +
        getRegBit(regnum2) +
        getImmBit(parseInt(components[3]));
    } else if (components[0] == "lw") {
      bitstr += "100000";
      let regnum1 = parseInt(components[1].slice(1, components[1].length), 10);
      let regnum2 = parseInt(components[2].slice(1, components[2].length), 10);
      bitstr +=
        getRegBit(regnum1) +
        getRegBit(regnum2) +
        getImmBit(parseInt(components[3]));
    } else if (components[0] == "brsm") {
      bitstr += "101000";
      let regnum1 = parseInt(components[1].slice(1, components[1].length), 10);
      let regnum2 = parseInt(components[2].slice(1, components[2].length), 10);
      bitstr +=
        getRegBit(regnum1) +
        getRegBit(regnum2) +
        getImmBit(parseInt(components[3]));
    } else if (components[0] == "breq") {
      bitstr += "110000";
      let regnum1 = parseInt(components[1].slice(1, components[1].length), 10);
      let regnum2 = parseInt(components[2].slice(1, components[2].length), 10);
      bitstr +=
        getRegBit(regnum1) +
        getRegBit(regnum2) +
        getImmBit(parseInt(components[3]));
    } else if (components[0] == "jmp") {
      bitstr += "111000";
      bitstr +=
        getRegBit(0) + getRegBit(0) + getImmBit(parseInt(components[1]));
    }
    ret.push(bitstr);
  }
  return ret;
}
