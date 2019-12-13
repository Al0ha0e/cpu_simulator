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
    let bitstr = "";
    if (components[0] == "addimm") {
      bitstr += "010000";
      let regnum1 = parseInt(components[1].slice(1, components[1].length), 10);
      let regnum2 = parseInt(components[2].slice(1, components[2].length), 10);
      bitstr +=
        getRegBit(regnum1) + getRegBit(regnum2) + getImmBit(components[3]);
    } else if (components[0] == "add") {
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
    } else if (components[0] == "put") {
      bitstr += "111001";
      let regnum = parseInt(components[1].slice(1, components[1].length), 10);
      bitstr += getRegBit(regnum) + getRegBit(0) + getImmBit(0);
    } else if (components[0] == "iret") {
      bitstr += "010100";
      let regnum = parseInt(components[1].slice(1, components[1].length), 10);
      bitstr +=
        getRegBit(0) + getRegBit(regnum) + getImmBit(parseInt(components[2]));
    } else if (components[0].slice(0, 5) == "eirev") {
      bitstr = "01010100000000000000000000000000";
    } else if (components[0].slice(0, 3) == "exe") {
      bitstr = "01011000000000000000000000000000";
    } else if (components[0].slice(0, 4) == "open") {
      bitstr = "01011100000000000000000000000000";
    } else if (components[0].slice(0, 3) == "stp") {
      bitstr = "00000000000000000000000000000000";
    } else if (components[0].slice(0, 4) == "pret") {
      bitstr = "00000100000000000000000000000000";
    }
    ret.push(bitstr);
  }
  return ret;
}
