const { dialog } = require("electron").remote;
const { ipcRenderer } = require("electron");
const fs = require("fs");
function cpuLog(content) {
  let event = new CustomEvent("cpulog", { detail: content });
  document.dispatchEvent(event);
}
class EI {
  constructor() {
    this.value = "0";
  }
  reverse() {
    this.value = this.value == "0" ? "1" : "0";
  }
}
class IRR {
  constructor() {
    this.value = "00000000000000000000000000000000";
  }
  clear() {
    this.value = "00000000000000000000000000000000";
  }
}
class PC {
  constructor() {
    this.PCWR = "0";
    this.Value = "00000000000000000000000000000000";
  }
  update(newValue) {
    if (this.PCWR == "1") {
      cpuLog("PC UPDATE TO " + getHexStr(newValue));
      this.Value = newValue;
    }
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
    console.log("FETCH ", this.Value);
    cpuLog(
      "FETCH INSTRUCTION " +
        getHexStr(this.Value) +
        " INSTR " +
        this.getInstr() +
        " RS " +
        this.getRs() +
        " RT " +
        this.getRt() +
        " IMM " +
        getHexStr(this.getImm())
    );
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
      cpuLog("UPDATE REGISTER AT " + this.address1 + " TO " + getHexStr(input));
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
      cpuLog(
        "UPDATE RAM AT " + getHexStr(this.addrress) + " TO " + getHexStr(input)
      );
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
        return "0";
      } else {
        return "1";
      }
    }
  }
}

function controller(instr) {
  if (instr == "000000") {
    return ["000000000000000"];
  }
  if (instr == "001000") {
    //SET
    return ["000000000000000", "110000000000000"];
  } else if (instr == "010000") {
    return ["000000110001000", "110000110001000"];
  } else if (instr == "010001") {
    //PLUS
    return ["000000100001000", "110000100001000"];
  } else if (instr == "010010") {
    //MINUS
    return ["000000100010000", "110000100010000"];
  } else if (instr == "010100") {
    //IRET
    return ["000000010001011", "100000010001100"];
  } else if (instr == "010101") {
    //EIREV
    return ["000000000000001", "100000000000000"];
  } else if (instr == "010110") {
    //EXE
    return ["000000000000000", "100000000000000"];
  } else if (instr == "010111") {
    //OPEN
    return ["000000000000000", "100000000000000"];
  } else if (instr == "000001") {
    return ["000000000000000", "100000000000000"];
  } else if (instr == "011000") {
    //SW
    return ["000000010001000", "000000010001000", "101000010001000"];
  } else if (instr == "100000") {
    // LW
    return ["000000010001000", "000000010001000", "110001010001000"];
  } else if (instr == "101000") {
    //brsm
    return ["000000000010000", "000000000010000", "100100000010000"];
  } else if (instr == "110000") {
    //breq
    return ["000000000010000", "000000000010000", "100110000010000"];
  } else if (instr == "111000") {
    //J
    return ["000010000000000", "000010000000000", "100010000000000"];
  } else if (instr == "111001") {
    return ["000000000000000", "100000000000000"];
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
  return ret;
}
function getHexStr(x) {
  let ret = "";
  for (let i = 0; i < x.length / 4; i++) {
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
    cpuLog("INIT CPU");
    this.ei = new EI();
    this.irr = new IRR();
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
    this.newInstr = true;
  }
  updateInstr() {
    if (this.update()) return true;
    while (!this.newInstr) {
      if (this.update()) return true;
    }
    //this.microPC = 0;
  }
  update() {
    if (this.newInstr) {
      let id = this.pc.getValue();
      // Get Instruction
      this.ir.fetchInstr(id);
      this.instr = this.ir.Value;
      // Get MircoInstruction
      this.microInstr = controller(this.ir.getInstr());
      this.microPC = 0;
      // STOP
      if (this.microInstr == "000000000000000") {
        cpuLog("CPU STOP!");
        return true;
      }
      //Execute Micro Instruction
      this.newInstr = false;
      this.executeMircoIsntruction();
    } else {
      //Execute Micro Instruction
      this.executeMircoIsntruction();
    }
    if (this.microPC == this.microInstr.length) {
      this.newInstr = true;
      this.microPC = 0;
    }
    return false;
  }
  executeMircoIsntruction() {
    cpuLog("EXECUTE MICRO INSTRUCTION");
    let instr = this.microInstr[this.microPC];
    if (instr[13] == "1") {
      this.irr.clear();
    }
    if (instr[14] == "1") {
      this.ei.reverse();
    }
    this.pc.PCWR = instr[0];
    this.reg.regWR = instr[1];
    this.ram.memoryWR = instr[2];
    cpuLog(
      "SET PCWR " + instr[0] + " REGWR " + instr[1] + " MEMORYWR " + instr[2]
    );
    this.reg.address1 = this.ir.getRs();
    this.reg.address2 = this.ir.getRt();
    cpuLog("SET REG1 " + this.reg.address1 + " REG2 " + this.reg.address2);
    this.pcController.state = instr[3] + instr[4];
    cpuLog("SET PC MUX CONTROLLER " + this.pcController.state);
    this.regmux.sign = instr[5] + instr[6];
    this.alumux.sign = instr[7];
    cpuLog("SET REG MUX " + this.regmux.sign);
    cpuLog("SET ALU MUX " + this.alumux.sign);
    this.pcmux.input2 = this.ir.getImm();
    this.alu.state = instr.slice(8, 12);
    cpuLog("SET ALU STATE " + this.alu.state);
    let op1t = parseInt(this.reg.getOutput1(), 2);
    let op2 = parseInt(this.reg.getOutput2(), 2);
    cpuLog(
      "REGISTER OUTPUT1 " + getHexStr(op1t) + " OUTPUT2 " + getHexStr(op2)
    );
    let imm = parseInt(this.ir.getImm(), 2);
    this.alumux.input1 = op1t;
    this.alumux.input2 = imm;
    let op1 = this.alumux.getOutput();
    let aluOtp = this.alu.getOutput(op1, op2);
    let numstr = getBitStr(aluOtp);
    cpuLog(
      "ALU INPUT1 " +
        getBitStr(op1) +
        " INPUT2 " +
        getBitStr(op2) +
        " OUTPUT " +
        getHexStr(numstr)
    );
    this.ram.addrress = numstr;
    this.ram.update(this.reg.getOutput1());
    let ramOtpData = this.ram.getOutput();
    this.regmux.input1 = this.ir.getImm();
    this.regmux.input2 = numstr;
    this.regmux.input3 = ramOtpData;
    let dataToReg = this.regmux.getOutput();
    this.reg.update(dataToReg);
    this.pcmux.sign = this.pcController.getOutput(this.alu);
    let pcmuxOtp = this.pcmux.getOutput();
    let tpcValue = parseInt(this.pc.Value, 2) + parseInt(pcmuxOtp, 2);
    let pcValue = instr[12] == "1" ? numstr : getBitStr(tpcValue);
    this.pc.update(pcValue);
    this.microPC++;
  }
}

class Computer {
  constructor(program) {
    this.run = false;
    document.addEventListener("stop", () => {
      this.run = false;
    });
    this.init(program);
  }
  init(program) {
    this.state = "init";
    this.cpu = new CPU(program, program.length);
    this.instrMemory = [program];
    this.ram = [new RAM()];
    let event = new CustomEvent("init", { detail: this });
    document.dispatchEvent(event);
  }
  clear() {
    let program = this.cpu.program;
    this.init(program);
  }
  switchTo(from, to) {
    console.log("SWITCH", from, to);
    this.instrMemory[from] = this.cpu.program;
    this.ram[from] = this.cpu.ram;
    this.cpu.program = this.cpu.ir.instrMemory = this.instrMemory[to];
    this.cpu.programLength = this.cpu.program.length;
    this.cpu.ram = this.ram[to];
    let event = new CustomEvent("switchTo", { detail: { from: from, to: to } });
    document.dispatchEvent(event);
  }
  interrupt(type) {
    if (this.cpu.ei.value == "0") return;
    this.cpu.ei.reverse(); //close interrupt
    this.cpu.reg.memory[3] = this.cpu.irr.value;
    this.cpu.reg.memory[2] = this.cpu.pc.Value;
    let newPC = parseInt(this.cpu.reg.memory[0], 2) + parseInt(type, 2);
    this.cpu.pc.Value = getBitStr(newPC); //set pc
    let pid = parseInt(this.cpu.reg.memory[1]);
    this.switchTo(pid, 0);
  }
  update() {
    let id = this.cpu.pc.getValue();
    let instr = this.cpu.ir.instrMemory[id];
    if (this.cpu.newInstr) {
      if (instr == "01011000000000000000000000000000") {
        //execute
        let pid = parseInt(this.cpu.reg.memory[1]);
        let path = dialog.showOpenDialogSync({ properties: ["openFile"] })[0];
        this.instrMemory[pid] = parse(fs.readFileSync(path, "utf8"));
        this.ram[pid] = new RAM();
        //this.switchTo(0, pid);
      } else if (instr == "01011100000000000000000000000000") {
        ipcRenderer.send("openConsole");
      } else if (instr.slice(0, 6) == "111001") {
        let r = parseInt(instr.slice(6, 11), 2);
        ipcRenderer.send("put", parseInt(this.cpu.reg.memory[r], 2));
      }
    }
    if (this.cpu.update()) {
      this.state = "terminated";
      return false;
    }
    if (this.cpu.newInstr && instr.slice(0, 6) == "010100") {
      //interruption over
      let pid = parseInt(this.cpu.reg.memory[1]);
      this.switchTo(0, pid);
    } else if (this.cpu.newInstr && instr.slice(0, 6) == "000001") {
      this.interrupt("01001101");
    } else if (
      this.cpu.newInstr &&
      this.cpu.irr.value != "00000000000000000000000000000000"
    ) {
      this.interrupt(0);
    }
    if (this.state != "cRunning") this.state = "running";
    return true;
  }
  updateInstr() {
    if (!this.update()) {
      this.state = "terminated";
      return false;
    }
    if (this.state != "cRunning") this.state = "running";
    while (!this.cpu.newInstr) {
      if (!this.update()) return false;
    }
    return true;
  }
  sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  continuouslyUpdate() {
    let that = this;
    that.run = true;
    this.state = "cRunning";
    let eve = new CustomEvent("update");
    (async function() {
      while (that.updateInstr()) {
        await that.sleep(0.5);
        document.dispatchEvent(eve);
        if (!that.run) {
          that.state = "running";
          return;
        }
      }
      that.state = "terminated";
    })();
  }
}
