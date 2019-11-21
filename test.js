class PC {
  constructor() {
    this.PCWR = "0";
    this.Value = "00000000000000000000000000000000";
  }
  update(newValue) {
    if (this.PCWR == "1") this.Value = newValue;
  }
  getValue() {
    return parseInt(this.Value, 2);
  }
}

class IR {
  constructor(instrMemory) {
    this.Value = "00000000000000000000000000000000";
    this.instrMemory = instrMemory;
  }
  getInstr() {
    return this.Value.slice(0, 6);
  }
  getRs() {
    return this.Value.slice(6, 11);
  }
  getRt() {
    return this.Value.slice(11, 16);
  }
  getImm() {
    let imm = this.Value.slice(16, 32);
    if (imm[0] == "0") {
      imm = "0000000000000000" + imm;
    } else {
      imm = "1111111111111111" + imm;
    }
    return imm;
  }
  fetchInstr(id) {
    this.Value = this.instrMemory[id];
  }
}

class Mux2 {
  constructor() {
    this.input1 = "00000000000000000000000000000000";
    this.input2 = "00000000000000000000000000000000";
    this.sign = "0";
  }
  getOutput() {
    if (this.sign == "0") return this.input1;
    return this.input2;
  }
}

class Mux4 {
  constructor() {
    this.input1 = "00000000000000000000000000000000";
    this.input2 = "00000000000000000000000000000000";
    this.input3 = "00000000000000000000000000000000";
    this.input4 = "00000000000000000000000000000000";
    this.sign = "00";
  }
  getOutput() {
    if (this.sign == "00") return this.input1;
    if (this.sign == "01") return this.input2;
    if (this.sign == "10") return this.input3;
    if (this.sign == "11") return this.input4;
  }
}

class register {
  constructor() {
    this.memory = [];
    for (let i = 0; i < 32; i++) {
      this.memory.push("00000000000000000000000000000000");
    }
    this.address1 = "00000";
    this.address2 = "00000";
    this.regWR = "0";
  }
  getOutput1() {
    let pos = parseInt(this.address1, 2);
    return this.memory[pos];
  }
  getOutput2() {
    let pos = parseInt(this.address2, 2);
    return this.memory[pos];
  }
  update(input) {
    if (this.regWR == "1") {
      let pos = parseInt(this.address1, 2);
      this.memory[pos] = input;
    }
  }
  show() {
    for (let i = 0; i < 32; i++) {
      console.log(this.memory[i]);
    }
  }
}

class RAM {
  constructor() {
    this.memoryWR = "0";
    this.addrress = "00000000000000000000000000000000";
    this.memory = [];
    for (let i = 0; i < 1024; i++) {
      this.memory.push("00000000000000000000000000000000");
    }
  }
  update(input) {
    if (this.memoryWR == "1") {
      let pos = parseInt(this.addrress, 2);
      this.memory[pos] = input;
    }
  }
  getOutput() {
    let pos = parseInt(this.addrress, 2);
    return this.memory[pos];
  }
  show() {
    console.log("RAM");
    for (let i = 0; i < 32; i++) {
      console.log(this.memory[i]);
    }
  }
}

class ALU {
  constructor() {
    this.negaFlag = "0";
    this.zeroFlag = "1";
    this.state = "0000";
  }
  getOutput(input1, input2) {
    console.log("ALU STATE", this.state);
    if (this.state == "0001") {
      let ret = input1 + input2;
      if (ret == 0) {
        this.zeroFlag = "1";
        this.negaFlag = "0";
      } else if (ret < 0) {
        this.negaFlag = "1";
        this.zeroFlag = "0";
      }
      return ret;
    } else if (this.state == "0010") {
      let ret = input1 - input2;
      if (ret == 0) {
        this.zeroFlag = "1";
        this.negaFlag = "0";
      } else if (ret < 0) {
        this.negaFlag = "1";
        this.zeroFlag = "0";
      } else if (ret > 0) {
        this.negaFlag = "0";
        this.zeroFlag = "0";
      }
      return ret;
    }
    return 0;
  }
}

class pcController {
  constructor() {
    this.state = "00";
  }
  getOutput(ALU) {
    if (this.state == "00") {
      return "0";
    } else if (this.state == "01") {
      return "1";
    } else if (this.state == "10") {
      if (ALU.negaFlag == "1") {
        return "0";
      } else {
        return "1";
      }
    } else {
      if (ALU.zeroFlag == "1") {
        console.log("ERO!");
        return "0";
      } else {
        return "1";
      }
    }
  }
}

function controller(instr) {
  if (instr == "001000") {
    //SET
    return ["000000000000", "110000000000"];
  } else if (instr.slice(0, 3) == "010") {
    //R
    let ret = ["000000100000", "1100001000000"];
    if (instr == "010001") {
      //PLUS
      ret[0] = "000000100001";
      ret[1] = "110000100001";
    } else if (instr == "010010") {
      //MINUS
      ret[0] = "000000100010";
      ret[1] = "110000100010";
    }
    return ret;
  } else if (instr == "011000") {
    //SW
    return ["000000010001", "000000010001", "101000010001"];
  } else if (instr == "100000") {
    // LW
    return ["000000010001", "000000010001", "110001010001"];
  } else if (instr == "101000") {
    //brsm
    return ["000000000010", "000000000010", "100100000010"];
  } else if (instr == "110000") {
    //breq
    return ["000000000010", "000000000010", "100110000010"];
  } else if (instr == "111000") {
    //J
    return ["000010000000", "000010000000", "100010000000"];
  }
}
function getBitStr(x) {
  let ret = "";
  for (let i = 31; i >= 0; i--) {
    if ((x & (1 << i)) > 0) {
      ret = ret.concat("1");
    } else {
      ret = ret.concat("0");
    }
  }
  console.log("BIT STR", ret);
  return ret;
}
function getHexStr(x) {
  let ret = "";
  for (let i = 0; i < 8; i++) {
    let str = x.slice(i * 4, i * 4 + 4);
    if (str == "1010") {
      ret += "A";
    } else if (str == "1011") {
      ret += "B";
    } else if (str == "1100") {
      ret += "C";
    } else if (str == "1101") {
      ret += "D";
    } else if (str == "1110") {
      ret += "E";
    } else if (str == "1111") {
      ret += "F";
    } else {
      ret += parseInt(str, 2);
    }
  }
  return ret;
}
class CPU {
  constructor(program, programLength) {
    this.init(program, programLength);
  }
  init(program, programLength) {
    this.pc = new PC();
    this.ir = new IR(program);
    this.regmux = new Mux4();
    this.pcmux = new Mux2();
    this.pcmux.input1 = "00000000000000000000000000000001";
    this.alumux = new Mux2();
    this.reg = new register();
    this.ram = new RAM();
    this.alu = new ALU();
    this.pcController = new pcController();
    this.instr = "";
    this.microInstr = [];
    this.microPC = 0;
    this.programLength = programLength;
    this.program = program;
  }
  updateInstr() {
    this.update();
    while (this.microPC < this.microInstr.length) {
      this.update();
    }
    //this.microPC = 0;
  }
  update() {
    if (this.microPC == this.microInstr.length) {
      let id = this.pc.getValue();
      if (id >= this.programLength) {
        console.log("OVER!");
        return;
      }
      // Get Instruction
      this.ir.fetchInstr(id);
      this.instr = this.ir.Value;
      console.log("NEW INSTR", this.instr);
      // Get MircoInstruction
      this.microInstr = controller(this.ir.getInstr());
      this.microPC = 0;
      //Execute Micro Instruction
      this.executeMircoIsntruction();
    } else {
      //Execute Micro Instruction
      this.executeMircoIsntruction();
    }
  }
  executeMircoIsntruction() {
    console.log("mExecute");
    let instr = this.microInstr[this.microPC];
    console.log("minstr ", instr);
    this.pc.PCWR = instr[0];
    this.reg.regWR = instr[1];
    this.reg.address1 = this.ir.getRs();
    this.reg.address2 = this.ir.getRt();
    this.ram.memoryWR = instr[2];
    this.pcController.state = instr[3] + instr[4];
    this.regmux.sign = instr[5] + instr[6];
    this.alumux.sign = instr[7];
    this.pcmux.input2 = this.ir.getImm();
    this.alu.state = instr.slice(8, 12);
    let op1 = parseInt(this.reg.getOutput1(), 2);
    let op2t = parseInt(this.reg.getOutput2(), 2);
    let imm = parseInt(this.ir.getImm(), 2);
    console.log("op2t", op2t, "imm", imm);
    this.alumux.input1 = op2t;
    this.alumux.input2 = imm;
    let op2 = this.alumux.getOutput();
    let aluOtp = this.alu.getOutput(op1, op2);
    console.log("op1", op1, "op2", op2, "aluOtp", aluOtp);
    //ATTENTION!!! NUM IS NOT A STRING!!!
    let numstr = getBitStr(aluOtp);
    this.ram.addrress = numstr;
    this.ram.update(this.reg.getOutput2());
    let ramOtpData = this.ram.getOutput();
    console.log("ramOtp", ramOtpData);
    this.regmux.input1 = this.ir.getImm();
    this.regmux.input2 = numstr;
    this.regmux.input3 = ramOtpData;
    let dataToReg = this.regmux.getOutput();
    console.log("dataToReg", dataToReg);
    this.reg.update(dataToReg);
    this.pcmux.sign = this.pcController.getOutput(this.alu);
    let pcmuxOtp = this.pcmux.getOutput();
    console.log("future pc", pcmuxOtp);
    let tpcValue = parseInt(this.pc.Value, 2) + parseInt(pcmuxOtp, 2);
    console.log("tpcValue", tpcValue);
    let pcValue = getBitStr(tpcValue);
    this.pc.update(pcValue); //ATTENTION !!! TYPE NOT MATCH!!!
    this.microPC++;
    console.log("mPC: ", this.microPC, " PC: ", this.pc.Value);
  }
}
