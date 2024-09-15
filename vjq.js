"use strict";
const vjq = require("./vjq-modules");

console.log(vjq.getType([[]]));

if( process.argv.length > 2 ){
  const os = process.argv[2];
  if(process.argv.length == 3){
    if(["win", "unix"].includes(os)){
      vjq.set();
      console.log("Forgot vjq commands? Get help:\nvjq --help");
    } else if(os.includes("-")){
      console.log("sorry, there is a syntax error in the node parameters.");
    } else{
      console.log("sorry, there is a syntax error in the node parameters, or this project is not supported for OS: " + os + ".");
    }
  } else {
    if(["win", "unix"].includes(os)){
      let isInstalled = false;
      const optionMap = vjq.units.getOptions(process.argv.slice(3));
      const optionMapKeys = Object.keys(optionMap);
      if((settingInfo.checkedIfExistClasp || false) == false) {
        vjq.main.checkIfInstalled();
      }
      vjq.main.login();
      if(optionMapKeys.includes("help")){
        delete optionMap.help;
        vjq.main.help(optionMap);
      } else if(optionMapKeys.includes("init")){
        if(isInstalled){
          vjq.main.init();
        }
      } else{
        if(optionMapKeys.includes("deploy")){
          vjq.main.deploy({normal: optionMap.deploy, titles: optionMap.title || [], titleCode: optionMap.titleCode});
        } else if(optionMapKeys.includes("push")) {
          vjq.main.push(optionMap.push);
        }
        if(optionMapKeys.includes("open")){
          vjq.main.open(optionMap.open);
        }
      }
    } else if (os.includes("-")){
      console.log("sorry, there is a syntax error in the node parameters.");
    } else {
      console.log("sorry, there is a syntax error in the node parameters, or this project is not supported for OS: " + os + ".");
    }
  }
} else {
  console.log("sorry, failed to get os information.");
}