"use strict";
const vjq = require("./vjq-modules");

const main = function () {
  if( process.argv.length == 2 ){
    console.error("syntax error. please input node vjq [win/unix] [options]");
    vjq.end();
  } else {
    const os = process.argv[2];
    if(["win", "unix"].includes(os)){
      if(process.argv.length == 3) {
        vjq.log({
          "en": "please input options",
          "jp": "オプションを入力してください。"
        });
        vjq.main.help();
        vjq.end();
      } else {
        vjq.set("os", os);
        const optionMap = vjq.units.getOptions(process.argv.slice(3));
        const optionMapKeys = Object.keys(optionMap);
        vjq.main.checkIfInstalled(optionMapKeys.includes("force-check"));
        vjq.main.login();
        if(optionMapKeys.includes("version")){
          vjq.main.version();
          vjq.end();
        } else if (optionMapKeys.includes("help")){
          delete optionMap.help;
          vjq.main.help(optionMap);
          vjq.end();
        } else if(optionMapKeys.includes("init")){
          vjq.main.init();
        } else if(optionMapKeys.includes("setting")) {
          vjq.main.setting(optionMap.setting, normalTask(optionMap))
        } else {
          normalTask(optionMap);
          vjq.end();
        }
      }
    } else {
      vjq.end();
    }
  }
}

const normalTask = function (optionMap){
  const optionMapKeys = Object.keys(optionMap);
  if(optionMapKeys.includes("deploy")){
    vjq.main.deploy({normal: optionMap.deploy, titles: optionMap.title || [], titleCode: optionMap.titleCode});
  } else if(optionMapKeys.includes("push")) {
    vjq.main.push(optionMap.push);
  }
  if(optionMapKeys.includes("open")){
    vjq.main.open(optionMap.open);
  }
}

main();