"use strict";
const fs = require('node:fs');
const { execSync } = require('child_process');
const { isArgumentsObject } = require('node:util/types');

const settingInfo = fs.existsSync("VJQsetting.json") ? (JSON.parse(fs.readFileSync("VJQsetting.json", "utf8").toString()) || {}) : {};
const ignoreFiles = Object.freeze(["vjq-win.cmd", "vjq.js", "vjq-help.json", "VJQsetting.json"]);
class ArgOptionData{
  constructor(){
    this.optionList = ["help", "init", "open", "deploy", "push", "title", "setting", "skip-check"];
    this.warningOptionList = ["pull"];
    this.converterMap = {
      "h": "help",
      "i": "init",
      "o": "open",
      "d": "deploy",
      "p": "push",
      "t": "title",
      "s": "setting",
      "sc": "skip-check"
    };
    Object.defineProperty(this, "inputtedWarningOptionList", {enumerable: false, writable: false, value: []});
  }
}

ArgOptionData.prototype.addWarningOptions = Object.freeze(function(value){
  if(this.warningOptionList.includes(value) && !this.inputtedWarningOptionList.includes(value)){
    this.inputtedWarningOptionList.push(value);
  }
  console.log(value, this.inputtedWarningOptionList);
});
ArgOptionData.prototype.getWarningOptions = Object.freeze(function(){
  return this.inputtedWarningOptionList;
});

const main = Object.freeze({
  help(details={}){
    const helpData = efs.file.read("vjq-help.json", false);
    console.log(helpData);
    console.log(details);
  },
  checkIfInstalled(){
    let isInstalled = true;
    console.log("checking if clasp existsing in your environment. please wait...");
    if(efs.doExec("clasp -v").filter( (x) => x != "" ).length > 1){
      isInstalled = false;
      doExex("install -g @google/clasp");
      main.login();
      main.init();
    }
    return isInstalled;
  },
  deploy(options = []){
    let titleSetCode = "";
    switch(options.titles.length){
      case 0:
        break;
      case 1:
        titleSetCode = " -d " + options.titles[0];
        break;
      default:
        console.log("The number of parameters of " + options.titleCode + " option must be one. please select a title.");
        return;
    }
    console.log(titleSetCode);
    if(options.normal.includes("new") || options.normal.includes("n")) {
      units.toHtml()
      clasp.push();
      clasp.deploy("", titleSetCode);
      units.toJsOrCss()
    } else {
      if(settingInfo.deployId) {
        units.toHtml()
        clasp.push();
        clasp.deploy(settingInfo.deployId, titleSetCode);
        units.toJsOrCss()
      } else {
        const result = clasp.setDeployAndHeadId();
        if(!result.didDeploy){
          units.toHtml()
          clasp.push();
          clasp.deploy(result.deploy.id, titleSetCode);
          units.toJsOrCss()
        }
      }
    }
  },
  push(){
    units.toHtml()
    clasp.push();
    units.toJsOrCss()
  },
  login(){
    if(this.get("os")){}
    const accountInfoFilePath = `C:/Users/${efs.doExec("whoami")[0].split("\\")[1]}/.clasprc.json`;
    if(!efs.file.isExist(accountInfoFilePath)){
      console.log("you did not login thus run clasp login");
      efs.doExec("clasp login");
    }
  },
  init(){
    efs.doExec("clasp create");
    units.runAllSettings();
    clasp.deploy("", " -d initialDeploy");
  },
  open(params = []){
    const claspInfo = efs.file.read(".clasp.json", false) || {};
    if(params.includes("gas") || params.includes("g") || params.length == 0){
      if(claspInfo.scriptId){
        efs.doExec(`start https://script.google.com/home/projects/${claspInfo.scriptId}/edit`);
      } else {
        efs.doExec("echo running clasp create because there is no setting file or there is broken setting file");
        efs.deleteFile(".clasp.json", false);
        efs.doExec("clasp create");
        efs.doExec(`start https://script.google.com/home/projects/${efs.file.read(".clasp.json", false).scriptId}/edit`);
      }
    }
    if(params.includes("exec") || params.includes("e") || params.length == 0) {
      if(settingInfo.deployId){
        efs.doExec(`start https://script.google.com/macros/s/${settingInfo.deployId}/exec`);
      } else{
        efs.doExec(`start https://script.google.com/macros/s/${clasp.setDeployAndHeadId().deploy.id}/dev`);
      }
    }
    if(params.includes("debug") || params.includes("d") || params.length == 0) {
      if(settingInfo.headId){
        efs.doExec(`start https://script.google.com/macros/s/${settingInfo.headId}/dev`);
      } else {
        efs.doExec(`start https://script.google.com/macros/s/${clasp.setDeployAndHeadId().head.id}/dev`);
      }
    }
  }
});

const efs = Object.freeze({
  doExec(cmd = "echo no command was inputted", isOutputArrayFormat = true, isOutputToCommandLine = false){
    const output = execSync(cmd).toString();
    if(isOutputToCommandLine){
      console.log(output);
    } else if (cmd.includes("& echo ") || cmd.startsWith("echo ")){
      console.log(output);
    }
    if(isOutputArrayFormat){
      return output.split("\n").map( (x) => x.replaceAll("\r", "") );
    } else {
      return output
    }
  },
  file: {
    updateJsonFile(path="", object={}){
      const loadedObject = efs.file.read(path, false);
      let newObject = {};
      if(loadedObject){
        for(const key of Object.keys(loadedObject)){
          newObject[key] = loadedObject[key];
        }
        for(const key of Object.keys(object)){
          newObject[key] = object[key]
        }
        if(units.isSameObject(loadedObject, newObject)){
          console.log(`there is no things to update`);
        } else{
          efs.file.write(path, newObject);
          console.log(`${path} was updated.`);
        }
      } else {
        for(const key of Object.keys(object)){
          newObject[key] = object[key]
        }
        efs.file.write(path, newObject);
        console.log(`${path} was created.`);
      }
      return newObject;
    },
    read(path="", showComment=true){
      function defaultValue(){
        switch (type) {
          case "json":
            return {};
          default:
            return null;
        }
      }

      const type = path.split(".").at(-1);
      switch (efs.file.isFile(path, showComment)) {
        case true:
          switch (type) {
            case "json":
              return JSON.parse(fs.readFileSync(path, "utf-8"));
            default:
              return fs.readFileSync(path, "utf-8");
          }
        case false:
          return defaultValue();
        default:
          if(showComment){
            console.log("thus return null");
          }
          return null;
      }
      return
    },
    write(path="", content="test"){
      if(["object", "array"].includes(units.getTypeOfObject(content))){
        fs.writeFileSync(path, JSON.stringify(content, null, 2), "utf-8");
      } else {
        fs.writeFileSync(path, content, "utf-8");
      }
    },
    delete(path="", showComment=true){
      if(efs.file.isExist(path)){
        fs.unlinkSync(path);
        if(showComment){
          console.log("deleted " + path);
        }
      } else if (showComment) {
        console.log(`cannot delete ${path} because ${path} does not exist.`);
      }
    },
    isExist(path=""){
      return fs.existsSync(path);
    },
    isFile(path="", showComment=true){
      if(efs.file.isExist(path)){
        return fs.lstatSync(path).isFile();
      } else {
        if(showComment){
          console.log(`${path} does not exist.`);
        }
        return null;
      }
    }
  }
});

const setSetting = Object.freeze({
  ignoreFiles(){
    if(efs.file.isExist(".claspignore")){
      let currentIgnoreFiles = [];
      for(let line of efs.doExec("type .claspignore")){
        if(line != ""){
          currentIgnoreFiles.push(line.slice(2));
        }
      }
      for(const ignoreFile of ignoreFiles) {
        if(!currentIgnoreFiles.includes(ignoreFile)){
          efs.doExec(`echo **/${ignoreFile}>> .claspignore`);
        }
      }
    } else {
      for(const ignoreFile of ignoreFiles){
        doExec(`echo **/${ignoreFile}>> .claspignore`);
      }
    }
  },
  appInfo(){
    const typeSelections = ["standalone", "docs", "sheets", "slides", "forms", "webapp", "api"];
    const executeAs = ["USER_ACCESSING", "USER_DEPLOYING", "SERVICE_ACCOUNT", "UNKNOWN_EXECUTE_AS"];
    const accessAs = ["UNKNOWN_ACCESS", "DOMAIN", "ANYONE", "ANYONE_ANONYMOUS", "MYSELF"];
    if(!typeSelections.includes(settingInfo.appType)){}
    console.log(executeAs);
    console.log(accessAs);
  }
});

const units = Object.freeze({
  runAllSettings(){
    for(const key of Object.keys(setSetting)){
      setSetting[key]();
    }
  },
  getTypeOfObject(object){
    var toString = Object.prototype.toString;
    return toString.call(object).split(" ")[1].slice(0, -1).toLowerCase();
  },
  isSameObject(object1, object2, ignoreArrayOrder=false){
    if(units.getTypeOfObject(object1) == units.getTypeOfObject(object2)){
      switch (units.getTypeOfObject(object1)) {
        case "object":
          const keys = Object.keys(object1).toSorted();
          if(units.isSameObject(keys, Object.keys(object2).toSorted())){
            for(const key of keys){
              if(!units.isSameObject(object1[key], object2[key])){
                return false
              }
            }
            return true;
          } else{
            return false;
          }
          break;
        case "array":
          const length = object1.length;
          if(length == object2.length){
            if(ignoreArrayOrder){
              for (let i=0; i<length; i++) {
                let isIncluded = false;
                for(let j=0; j<length; j++){
                  if(units.isSameObject(object1[i], object2[j])){
                    isIncluded = true;
                    break;
                  }
                }
                if(!isIncluded){
                  return false;
                }
              }
            } else {
              for(let i=0; i<length; i++){
                if(!units.isSameObject(object1[i], object2[i])){
                  return false
                }
              }
            }
            return true;
          } else{
            return false;
          }
          break;
        default:
          return object1 == object2;
      }
      return;
    }
    return false;
  },
  toHtml(){
    for(const path of ["02-sample", "04-jsClass", "05-vue", "06-js\\0-previous", "06-js\\1-following"]){
      for(const readFileName of efs.doExec(`dir ${path} /B`)){
        if(readFileName.endsWith(".js")){
          const writeFileName = readFileName.split(".").slice(0, -1).join(".") + ".html";
          efs.doExec(`type ${path}\\${readFileName} > ${path}\\${writeFileName}`);
          efs.file.delete(path + "/" + readFileName, false);
        }
      }
    }
    for(const readFileName of efs.doExec("dir 07-stylesheet /B")){
      if(readFileName.endsWith(".css")){
        const writeFileName = readFileName.split(".").slice(0, -1).join(".") + ".html";
        efs.doExec(`type 07-stylesheet\\${readFileName} > 07-stylesheet\\${writeFileName}`);
        efs.file.delete("07-stylesheet/" + readFileName, false);
      }
    }
    console.log("updated to .html to run clasp push");
  },
  toJsOrCss(){
    for(const path of ["02-sample", "04-jsClass", "05-vue", "06-js\\0-previous", "06-js\\1-following"]){
      for(const readFileName of efs.doExec(`dir ${path} /B`)){
        if(readFileName.endsWith(".html")){
          const writeFileName = readFileName.split(".").slice(0, -1).join(".") + ".js";
          efs.doExec(`type ${path}\\${readFileName} > ${path}\\${writeFileName}`);
          efs.file.delete(path + "/" + readFileName, false);
        }
      }
    }
    for(const readFileName of efs.doExec("dir 07-stylesheet /B")){
      if(readFileName.endsWith(".html")){
        const writeFileName = readFileName.split(".").slice(0, -1).join(".") + ".css";
        efs.doExec(`type 07-stylesheet\\${readFileName} > 07-stylesheet\\${writeFileName}`);
        efs.file.delete("07-stylesheet/" + readFileName, false);
      }
    }
    console.log("updated to .js or .css to edit easily");
  },
  getOptions(args=[]){
    let returnObject = {titleCode: ""};
    let currentKey = "";
    let isCorrectKey = false;
    for(const arg of args) {
      switch (countInitialHyphen(arg)) {
        case 0:
          if(isCorrectKey){
            returnObject[currentKey].push(arg);
          }
          break;
        case 1:
          currentKey = removeInitialHyphens(arg);
          if(argOptionData.converterMap[currentKey]){
            currentKey = argOptionData.converterMap[currentKey];
            if(argOptionData.optionList.includes(currentKey)){
              returnObject.titleCode = arg;
              isCorrectKey = true;
              returnObject[currentKey] = returnObject[currentKey] || [];
            } else {
              argOptionData.addWarningOptions(arg);
              isCorrectKey = false;
              console.log(`option ${arg} does not exist.`);
            }
          } else{
            argOptionData.addWarningOptions(arg);
            isCorrectKey = false;
            console.log(`option ${arg} does not exist.`);
          }
          break;
        case 2:
          currentKey = removeInitialHyphens(arg);
          if(argOptionData.optionList.includes(currentKey)){
            returnObject.titleCode = arg;
            isCorrectKey = true;
            returnObject[currentKey] = returnObject[currentKey] || [];
          } else{
            argOptionData.addWarningOptions(arg);
            isCorrectKey = false;
            console.log(`option ${arg} does not exist.`);
          }
          break;
        default:
          console.log(`option ${arg} does not exist.`);
          isCorrectKey = false;
          break;
      }
    }
    return returnObject;
    
    function countInitialHyphen(text) {
      let returnValue = 0;
      for(const c of text){
        if(c == "-"){
          returnValue += 1;
        } else {
          return returnValue;
        }
      }
    }

    function removeInitialHyphens(text){
      let returnText = "";
      let isInitialHyphen = true;
      for(const c of text){
        if(c != "-"){
          isInitialHyphen = false;
        }
        if(!isInitialHyphen){
          returnText += c;
        }
      }
      return returnText;
    }
  },
  updateObject(oldObject, newObject){
    for(const key of Object.keys(newObject)){
      if(units.getTypeOfObject(newObject[key]) == "object"){
        oldObject[key] = oldObject[key] || {};
        this.updateObject(oldObject[key], newObject[key]);
      } else {
        oldObject[key] = newObject[key];
      }
    }
  }
});

const clasp = Object.freeze({
  push(){
    console.log("running clasp push. please wait...");
    efs.doExec("clasp push -f");
  },
  deploy(deployId="", titleCode=""){
    console.log("running clasp deploy. please wait...");
    if(deployId == ""){
      for(const line of efs.doExec(`clasp deploy${titleCode}`)){
        if(line.includes("@")){
          const newData = {deployId: line.split(" ")[1]};
          efs.file.updateJsonFile("VJQsetting.json", newData);
          settingInfo.updateMe(newData);
          break;
        }
      }
    } else {
      efs.doExec(`clasp deploy -i ${deployId}${titleCode}`);
    }
  },
  setDeployAndHeadId(){
    let returnObject = {head: {status:"unedited", id: ""}, deploy: {status:"unedited", id: ""}, "didDeploy": false};
    let isNeedToSet = false;
    if(settingInfo.headId){
      returnObject.head.id = settingInfo.headId;
    } else {
      returnObject.head.status = "edited";
      isNeedToSet = true;
    }
    if(settingInfo.deployId){
      returnObject.deploy.id = settingInfo.deployId;
    } else {
      returnObject.deploy.status = "edited";
      isNeedToSet = true;
    }
    if(isNeedToSet){
      console.log("searching deployments because there is a data gap. please wait...");
      for(const line of efs.doExec("clasp deployments")){
        if(line.includes("@HEAD")){
          if(returnObject.head.status == "edited"){
            returnObject.head.id = line.split(" ")[1]
          }
          if(returnObject.deploy.status == "unedited"){
            break;
          }
        } else if(line.includes("@")) {
          if(returnObject.deploy.status == "edited"){
            returnObject.deploy.id = line.split(" ")[1];
          }
          break;
        }
      }
      if(returnObject.deploy.id == ""){
        console.log("need to setup deployment because there is no deployment. \nrunning clasp push. please wait...");
        units.toHtml();
        efs.doExec("clasp push -f ");
        console.log("running clasp deploy. please wait...");
        for(const line of doExec("clasp deploy")){
          console.log(line);
          if(line.includes("@")){
            const words = line.split(" ");
            returnObject.deploy.id = words[1];
            break;
          }
        }
        returnObject.didDeploy = true;
        units.toJsOrCss();
      }
      const newData = {deployId: returnObject.deploy.id, headId: returnObject.head.id};
      efs.file.updateJsonFile("VJQsetting.json", newData);
      settingInfo.updateMe(newData);
    }
    return returnObject;
  }
});

const argOptionData = Object.freeze(new ArgOptionData());

Object.defineProperty(settingInfo, "updateMe", {value: Object.freeze(function(newObject){
  units.updateObject(this, newObject);
})});

const exportsObject = { settingInfo, ignoreFiles, argOptionData, main, efs, setSetting, units, clasp }
Object.defineProperty(exportsObject, "settings", {value: {}, writable: false });
Object.defineProperty(exportsObject, "getType", {value: Object.freeze(function(object, isArrayElement=false){
  if(isArrayElement){
    return object.length == 0 ? "array[any]" : `array[${this.getType(object[0])}]`;
  } else {
    const type = units.getTypeOfObject(object);
    return type == "array" ? this.getType(object, true) : type
  }
}), enumerable: true});
exportsObject.set = Object.freeze(function(key="", value){
  if(this.settings[key]){
    const currentType = this.settings[key].type;
    if(currentType.includes("[any]")){} else if (type == this.getType(value)){
      this.settings[key].value = value;
      console.log(`set ${value} to ${key} successfully.`);
    } else {
      console.log("cannot set because the variable type is incorrect.");
    }
  } else{
    const type = this.getType(value);
    this.settings[key] = {value: value, type: type.includes("[any]") ? type : Object.freeze(type)};
    console.log(`set ${value} to ${key} variable successfully.`);
  }
});
exportsObject.get = Object.freeze(function(key){
  if(this.settings[key]){
    return this.settings[key].value;
  } else {
    return null;
  }
});
exportsObject.push = Object.freeze(function(key, value){});

module.exports = exportsObject;