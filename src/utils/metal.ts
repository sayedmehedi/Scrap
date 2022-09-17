import {MetalCode} from "@src/types";

export const metalNameToCode = (name: string): MetalCode => {
  if (/copper/i.test(name)) {
    return "XCU";
  } else if (/silver/i.test(name)) {
    return "XAG";
  } else if (/platinum/i.test(name)) {
    return "XPT";
  } else if (/aluminium/i.test(name)) {
    return "ALU";
  } else if (/zinc/i.test(name)) {
    return "ZNC";
  } else if (/tin/i.test(name)) {
    return "TIN";
  } else if (/iron/i.test(name)) {
    return "IRON";
  } else {
    return "XAU";
  }
};
