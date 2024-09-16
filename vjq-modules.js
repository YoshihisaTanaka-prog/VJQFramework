 
"use strict";
const fs = require('node:fs');
const { execSync } = require('child_process');
const { createInterface } = require("node:readline/promises");

// start settings code for this project ==============================================================

const version = Object.freeze("1.0.0");
const supportedLangageList = Object.freeze(["en", "jp"]);
const ignoreFiles = Object.freeze(["test.js", "vjq-helper.json", "vjq-modules.js", "vjq.cmd", "vjq.js", "VJQsetting.json"]);

const argumentsOptionData = {
  optionList: ["help", "init", "open", "deploy", "push", "title", "setting", "force-check", "version"],
  warningOptionList: ["pull"],
  converterMap: {
    "h": "help",
    "i": "init",
    "o": "open",
    "d": "deploy",
    "p": "push",
    "t": "title",
    "s": "setting",
    "fc": "force-check",
    "v": "version"
  },
  choiceMap: {init: [], open: ["gas", "g", "exec", "e", "debug", "d"], deploy: ["n", "new"], push: [], "force-check": [], version: []}
};

// end settings code for this project ================================================================

// from here edit settings by code automatically------------------------------------------------------

const settingInfo = fs.existsSync("VJQsetting.json") ? (JSON.parse(fs.readFileSync("VJQsetting.json", "utf-8")) || {}) : {}

Object.defineProperty(settingInfo, "updateMe", {value: Object.freeze(function(newObject){
  units.updateObject(this, newObject);
  efs.file.updateJsonFile("VJQsetting.json", this);
})});


class ArgOptionData{
  constructor(object){
    this.optionList = Object.freeze(object.optionList);
    this.warningOptionList = Object.freeze(object.warningOptionList);
    this.converterMap = Object.freeze(object.converterMap);
    this.choiceMap = object.choiceMap;
    for(const key of Object.keys(this.choiceMap)){
      this.choiceMap[key] = Object.freeze(this.choiceMap[key])
    }
    Object.defineProperty(this, "inputtedWarningOptionList", {enumerable: false, writable: false, value: []});
    Object.defineProperty(this, "settingChoices", {enumerable: false, writable: false, value: []});
  }
  addWarningOptions = Object.freeze(function(value){
      this.inputtedWarningOptionList.push(value);
  })
  getWarningOptions = Object.freeze(function(){
    return this.inputtedWarningOptionList;
  });
}
const argOptionData = Object.freeze(new ArgOptionData(argumentsOptionData));

const confirmLanguageInfo = function(){
  if(settingInfo.lang){
    if(!supportedLangageList.includes(settingInfo.lang)){
      console.log("Selected language in setting file is not supported language. Thus set language to english. Saved value is \"en\"");
      settingInfo.updateMe({lang: "en"});
    }
  } else {
    console.log("There is no information for language in setting file. Thus set language to english. Saved value is \"en\"");
    settingInfo.updateMe({lang: "en"});
  }
}

const main = Object.freeze({
  help(details={}){
    const helpData = efs.file.read("vjq-help.json", false);
    console.log(helpData);
    console.log(details);
  },
  checkIfInstalled(forcedToCheck=false){
    if(!(settingInfo.checkedIfExistClasp || false) || forcedToCheck){
      console.log("checking if clasp exists in your environment. please wait...");
      const res = efs.doExec("clasp -v");
      if(res){
        console.log("checked if clasp exists in your environment.");
      } else {
        console.log("checked if clasp exists in your environment.\ninstalling clasp because clasp is not installed. open other window. please wait...");
        if(efs.doExec(`start cmd /c "echo installing clasp in this cli window. please wait... & echo If you finished installing and closed this window, please press enter in the previous cli window & cd . & npm install -g @google/clasp & vjq -init"`)){
          settingInfo.updateMe({checkedIfExistClasp: true});
        }
        vjq.end();
      }
    }
  },
  deploy(options = {normal: [], titles: []}, afterFunction=()=>{}, isInpute){
    if(efs.file.isExist(".clasp.json")){
      let titleSetCode = "";
      switch(options.titles.length){
        case 0:
          break;
        case 1:
          titleSetCode = ` -d  + ${JSON.stringify(options.titles[0])}`;
          break;
        default:
          console.log("The number of parameters of " + options.titleCode + " option must be one. please select a title.");
          return;
      }
      console.log(titleSetCode);
      if(options.includes("new") || options.includes("n")){
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
    } else{
      console.log("run clasp create becuse there is no setting file.");
      clasp.create(Object.keys(setSetting).filter( (x) => x != "language" ), () =>{
        main.deploy(options);
      });
    }
  },
  push(){
    if(efs.file.isExist(".clasp.json")){
      units.toHtml();
      clasp.push();
      units.toJsOrCss();
    } else {
      console.log("run clasp create becuse there is no setting file.");
      clasp.create(Object.keys(setSetting).filter( (x) => x != "language" ), ()=>{
        main.push();
      });
    }
  },
  login(){
    let accountInfoFilePath = "";
    switch (exportsObject.get("os")) {
      case "win":
        accountInfoFilePath = `C:/Users/${efs.doExec("whoami")[0].split("\\")[1]}/.clasprc.json`;
        break;
      case "unix":
        accountInfoFilePath = "~/.clasprc.json";
      default:
        break;
    }
    if(!efs.file.isExist(accountInfoFilePath)){
      console.log("you did not login thus run clasp login");
      efs.doExec("clasp login");
    }
  },
  init(){
    console.log("run clasp create to initialize.");
    clasp.create([], ()=>{
      clasp.deploy(" -d \"initial deploy\"");
    });
  },
  open(params = []){
    if(params.includes("gas") || params.includes("g")){
      if(claspInfo.scriptId){
        efs.doExec(`start https://script.google.com/home/projects/${claspInfo.scriptId}/edit`);
      } else {
        console.log("run clasp create because there is no setting file or there is broken setting file");
        efs.deleteFile(".clasp.json", false);
        clasp.create(() =>{
          efs.doExec(`start https://script.google.com/home/projects/${efs.file.read(".clasp.json", false).scriptId}/edit`);
        });
      }
    }
    if(params.includes("exec") || params.includes("e")){
      if(settingInfo.deployId){
        efs.doExec(`start https://script.google.com/macros/s/${settingInfo.deployId}/exec`);
      } else{
        efs.doExec(`start https://script.google.com/macros/s/${clasp.setDeployAndHeadId().deploy.id}/dev`);
      }
    }
    if(params.includes("debug") || params.includes("d")){
      if(settingInfo.headId){
        efs.doExec(`start https://script.google.com/macros/s/${settingInfo.headId}/dev`);
      } else {
        efs.doExec(`start https://script.google.com/macros/s/${clasp.setDeployAndHeadId().head.id}/dev`);
      }
    }
  },
  setting(args=[], afterFunc=()=>{}){
    function deleteInitialSpaces(text=""){
      for(let i=0; i<text.length; i++){
        if(text[i] != " "){
          return text.slice(i).replaceAll("\r","");
        }
      }
      return "";
    }
    let codes = [];
    if(args.length == 0){
      for(const key of Object.keys(setSetting)){
        codes.push({name: setSetting[key].toString().split("(")[0], code: setSetting[key].toString().toFunction().toString().split("\n").map( x => deleteInitialSpaces(x) ).join("\n")});
      }
    } else {
      for(const key of args){
        codes.push({name: setSetting[key].toString().split("(")[0], code: setSetting[key].toString().toFunction().toString().split("\n").map( x => deleteInitialSpaces(x) ).join("\n")});
      }
    }
    let mainCode = "function(afterFunc, myModule){\n";
    for(const code of codes){
      mainCode += `const ${code.name} = ${code.code};${"\n"}`;
    }
    let followingCode = "";
    for(const name of codes.map( (x) => x.name )){
      mainCode += `${name}(()=>{${"\n"}`;
      followingCode += "}, myModule);\n";
    }
    mainCode += `afterFunc();${"\n"}${followingCode}}${"\n"};`;
    const mainFunc = mainCode.toFunction();
    mainFunc(afterFunc, myModule);
  },
  version(){
    console.log(version);
  }
});

const efs = Object.freeze({
  doExec(cmd = "echo no command was inputted", isOutputArrayFormat = true, isOutputToCommandLine = false){
    try {
      const output = execSync(cmd).toString();
      if(isOutputToCommandLine){
        console.log(output);
      }
      if(isOutputArrayFormat){
        return output.split("\n").map( (x) => x.replaceAll("\r", "") );
      } else {
        return output;
      }
    } catch (e){
      return null;
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

const setSetting = {
  language(nextFunction=()=>{}, m=myModule){},
  setIgnoreFiles(nextFunction=()=>{}, m=myModule){
    if(m.efs.file.isExist(".claspignore")){
      let currentIgnoreFiles = [];
      for(let line of m.efs.doExec("type .claspignore")){
        if(line != ""){
          currentIgnoreFiles.push(line.slice(2));
        }
      }
      for(const ignoreFile of m.ignoreFiles) {
        if(!currentIgnoreFiles.includes(ignoreFile)){
          m.efs.doExec(`echo **/${ignoreFile}>> .claspignore`);
        }
      }
    } else {
      for(const ignoreFile of m.ignoreFiles){
        m.efs.doExec(`echo **/${ignoreFile}>> .claspignore`);
      }
    }
    nextFunction();
  },
  appInfo(nextFunction=()=>{}, m=myModule){
    const executeAs = ["USER_ACCESSING", "USER_DEPLOYING", "SERVICE_ACCOUNT", "UNKNOWN_EXECUTE_AS"];
    const accessAs = ["UNKNOWN_ACCESS", "DOMAIN", "ANYONE", "ANYONE_ANONYMOUS", "MYSELF"];
    const selectExecuteAs = async function(){
      const selectedExecuteValue = await m.readLine.question("execute >> ");
      return selectedExecuteValue;
    }
    const selectAccessAs = async function(){
      const selectedAccessValue = await m.readLine.question("access >> ");
      return selectedAccessValue;
    }

    selectExecuteAs().then((v)=>{
      const selectedExecuteValue = v;
      selectAccessAs().then((v)=>{
        const selectedAccessValue = v;
        console.log(selectedExecuteValue, selectedAccessValue);
        nextFunction();
      });
    });
  }
};

const units = Object.freeze({
  setSettingSettingOption(){
    for(const key of Object.keys(setSetting)){
      argOptionData.settingChoices.push(units.camelToHyphen(key));
    }
  },
  hyPhenToCamel(str=""){
    return str.toLowerCase().replace( /([-][a-z])/g, group => group.toUpperCase().replace("-", '') );
  },
  camelToHyphen(str=""){
    let returnValue = "";
    for(const c of str){
      if("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(c)){
        returnValue += `-${c.toLowerCase()}`
      } else{
        returnValue += c;
      }
    }
    return returnValue;
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
              for(let i=0; i<length; i++){
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
          efs.doExec(`type ${path}\\${readFileName} >> ${writeFileName}`);
          efs.file.delete(path + "/" + readFileName, false);
        }
      }
    }
    for(const readFileName of efs.doExec("dir 07-stylesheet /B")){
      if(readFileName.endsWith(".css")){
        const writeFileName = readFileName.split(".").slice(0, -1).join(".") + ".html";
        efs.doExec(`type 07-stylesheet\\${readFileName} >> ${writeFileName}`);
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
          efs.doExec(`type ${path}\\${readFileName} >> ${writeFileName}`);
          efs.file.delete(path + "/" + readFileName, false);
        }
      }
    }
    for(const readFileName of efs.doExec("dir 07-stylesheet /B")){
      if(readFileName.endsWith(".html")){
        const writeFileName = readFileName.split(".").slice(0, -1).join(".") + ".css";
        efs.doExec(`type 07-stylesheet\\${readFileName} >> ${writeFileName}`);
        efs.file.delete("07-stylesheet/" + readFileName, false);
      }
    }
    console.log("updated to .js or .css to edit easily");
  },
  getOptions(args=[]){
    let returnObject = {titleCode: ""};
    let currentKey = "";
    let currentInputtedKey = "";
    let isCorrectKey = false;
    let wrongOptionList = [];
    for(const arg of args) {
      switch (countInitialHyphen(arg)) {
        case 0:
          if(isCorrectKey){
            const errorLog = `${arg} is not included parameters of ${currentInputtedKey} option. thus this parameter is ignored.`;
            if (arg == "setting"){
              if(argOptionData.settingChoices.includes(arg)){
                returnObject[currentKey] = arg;
              } else {
                console.log(errorLog);
              }
            } else if(argOptionData.choiceMap[currentKey]) {
              if(argOptionData.choiceMap[currentKey].includes(arg)){
                returnObject[currentKey] = arg;
              } else{
                console.log(errorLog);
              }
            } else {
              returnObject[currentKey].push(arg);
            }
          }
          break;
        case 1:
          currentKey = removeInitialHyphens(arg);
          if(argOptionData.converterMap[currentKey]){
            currentKey = argOptionData.converterMap[currentKey];
            if(argOptionData.optionList.includes(currentKey)){
              returnObject.titleCode = arg;
              isCorrectKey = true;
              currentInputtedKey = arg;
            } else {
              argOptionData.addWarningOptions(currentKey);
              isCorrectKey = false;
              if(!wrongOptionList.includes(arg)){
                wrongOptionList.push(arg);
                console.log(`option ${arg} does not exist.`);
              }
            }
          } else{
            argOptionData.addWarningOptions(currentKey);
            isCorrectKey = false;
            if(!wrongOptionList.includes(arg)){
              wrongOptionList.push(arg);
              console.log(`option ${arg} does not exist.`);
            }
          }
          break;
        case 2:
          currentKey = removeInitialHyphens(arg);
          if(argOptionData.optionList.includes(currentKey)){
            returnObject.titleCode = arg;
            isCorrectKey = true;
            currentInputtedKey = arg;
          } else{
            argOptionData.addWarningOptions(currentKey);
            isCorrectKey = false;
            if(!wrongOptionList.includes(arg)){
              wrongOptionList.push(arg);
              if(!wrongOptionList.includes(arg)){
                wrongOptionList.push(arg);
                console.log(`option ${arg} does not exist.`);
              }
            }
          }
          break;
        default:
          if(!wrongOptionList.includes(arg)){
            wrongOptionList.push(arg);
            console.log(`option ${arg} does not exist.`);
          }
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
      const returnList = efs.doExec(`clasp deploy${titleCode}`);
      if(returnList){
        for(const line of returnList){
          if(line.includes("@")){
            const newData = {deployId: line.split(" ")[1]};
            settingInfo.updateMe(newData);
            break;
          }
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
      settingInfo.updateMe(newData);
    }
    return returnObject;
  },
  create: async function(settingLists=[], afterFunc=()=>{}){
    const typeSelections = ["standalone", "docs", "sheets", "slides", "forms", "webapp", "api"];
    const selectTitle = async function(message={}){
      let outputMessage = langFilter(message);
      if(outputMessage == ""){
        outputMessage = langFilter({
          "en": "Please enter the name of the file you want to upload to Google Drive. The default is \"" + JSON.stringify(parentFolder) + "\".",
          "jp": "グーグルドライブにアップロードするファイルの名前を入力してください。初期値は「" + JSON.stringify(parentFolder) + "」です。"
        });
      }
      const title = await readLine.question(outputMessage);
      if(title.includes('"')){
        return selectTitle({
          "en": "The file name you upload to Google Drive cannot contain '\"'. Please enter another name.",
          "jp": "グーグルドライブにアップロードするファイル名に「\"」を使うことはできません。他の名前を入力してください。"
        });
      } else if (title == "") {
        return JSON.stringify(parentFolder);
      } else {
        return JSON.stringify(await title);
      }
    }
    
    const selectType = async function(startText={}){
      const message = {
        "en": "Please choose from the following:\n" + typeSelections.join("\n") + "\n\ndefault is standalone.\n",
        "jp": "以下から選択してください。\n" + typeSelections.join("\n") + "\n\n初期値はstandalone.\n"
      };
      const type = await readLine.question(langFilter(startText) == "" ? "" : "\n" + langFilter(message));
      if(typeSelections.includes(type)){
        return type;
      } else if (type == ""){
        return "standalone";
      } else {
        return await selectType();
      }
    }
    const main = function(){
      selectTitle().then((t) =>{
        const title = t;
        selectType({
          "en": "What format of GAS do you want to generate?",
          "jp": "どの形式のGASを生成しますか？"
        }).then((t) =>{
          const type = t;
          settingInfo.updateMe({appType: type});
          console.log(title, type);
          efs.doExec(`clasp create --type ${type} --title ${title}`, true, true);
          main.setting(settingLists, ()=>{
            afterFunc();
          });
        });
      });
    }
    main();
  }
});

const langFilter = function(mapOrText={}){
  if( units.getTypeOfObject(mapOrText) == "object" ){
    if(mapOrText[settingInfo.lang]){
      return mapOrText[settingInfo.lang]
    } else{
      return JSON.stringify(mapOrText);
    }
  } else{
    return mapOrText;
  }
}

const log = function(mapOrText){
  console.log(langFilter(mapOrText));
}

String.prototype.toFunction = function(){
  const removeArrow = function(text){
    let isInitialized = false;
    let endArgsIndex = 0;
    let startBodyIndex = 0;
    let countBrackets = 0;
    for(let i=0; i<text.length; i++){
      if(text[i] == "("){
        countBrackets++;
        isInitialized = true;
      } else if(text[i] == ")"){
        countBrackets--;
      }
      if(countBrackets == 0 && isInitialized && endArgsIndex == 0){
        endArgsIndex = i+1;
      }
      if(text[i] == "{" && endArgsIndex != 0){
        startBodyIndex = i;
        break
      }
    }
    const prevCode = text.slice(0, endArgsIndex);
    const followingCode = text.slice(endArgsIndex);
    const arrowCode = text.slice(0, startBodyIndex).split(")").slice(-1)[0];
    return prevCode + followingCode.replace(arrowCode, "");
  };
  const prevCode = this.split('(')[0];
  return new Function(settingCode + "return " + removeArrow(this.replace(prevCode, "function ").replace("m=myModule","m")))();
}

const setReadLineAndGetCurrentPath = function (){
  const p = require("node:process");
  const input = p.stdin;
  const output = p.stdout;
  const parentFolder = p.cwd().split("\\").slice(-1)[0];
  const r1 = createInterface({ input, output });
  const r2 = createInterface({ input, output });
  r2.question = function(message=""){
    r1.question(message + "\n>> ");
  }
  return {readLine: r2, parentFolder: parentFolder};
}
const { readLine, parentFolder } = setReadLineAndGetCurrentPath();

function setExportObject(){
  for(let i=0; i<arguments.length; i++){
    const exportsObject = arguments[i];
    Object.defineProperty(exportsObject, "settings", {value: {}, writable: false });
    Object.defineProperty(exportsObject, "getType", {value: Object.freeze(function(object, isArrayElement=false){
      if(isArrayElement){
        return object.length == 0 ? "array[any]" : `array[${this.getType(object[0])}]`;
      } else {
        const type = units.getTypeOfObject(object);
        return type == "array" ? this.getType(object, true) : type
      }
    })});
    exportsObject.set = Object.freeze(function(key="", value, isMute=true){
      let logTextObject = {"en": "", "jp": ""};
      if(this.settings[key]){
        const currentType = this.settings[key].type;
        if(currentType.includes("[any]")){
          function getBracketsNum(){
            let returnArray = [];
            for(let i=0; i<arguments.length; i++){
              returnArray.push(arguments[i].split("").filter( (x) => x == "[" ).length);
            }
            return returnArray;
          }
          const newType = this.getType(value);
          const [currentNum, newNum] = getBracketsNum(currentType, newType);
          if(currentNum > newNum){
            logTextObject = {
              "en": `Property ${key} could not be modified because it is of a different type.`,
              "jp": `型が違うのでプロパティ${key}を修正できませんでした。`
            };
          } else {
            this.settings[key] = {value: value, type: newType.includes("[any]") ? newType : Object.freeze(newType)};
            logTextObject = {
              "en": `Property ${key} was successfully changed to ${JSON.stringify(value)}.`,
              "jp": `プロパティ ${key}を${JSON.stringify(value)}に変更できました。`
            };
          };
        } else if (currentType == this.getType(value)){
          this.settings[key].value = value;
          logTextObject = {
            "en": units.getTypeOfObject(value) == "function" ? `Property ${key} was successfully changed to the input function.` : `Property ${key} was successfully changed to ${JSON.stringify(value)}.`,
            "jp": units.getTypeOfObject(value) == "function" ? `プロパティ ${key}を入力された関数に変更できました。` : `プロパティ ${key}を${JSON.stringify(value)}に変更できました。`
          };
        } else {
          logTextObject = {
            "en": `Property ${key} could not be modified because it is of a different type.`,
            "jp": `型が違うのでプロパティ${key}を修正できませんでした。`
          };
        }
      } else{
        const type = this.getType(value);
        this.settings[key] = {value: value, type: type.includes("[any]") ? type : Object.freeze(type)};
        logTextObject = {
          "en": units.getTypeOfObject(value) == "function" ? `The entered function has been assigned to property ${key}.` : `${JSON.stringify(value)} has been assigned to property ${key}.`,
          "jp": units.getTypeOfObject(value) == "function" ? `入力された関数をプロパティ${key}に代入しました。` : `${JSON.stringify(value)}をプロパティ${key}に代入しました。`
        };
      }
      if(!isMute){
        console.log(langFilter(logTextObject));
      }
    });
    exportsObject.get = Object.freeze(function(key){
      if(this.settings[key]){
        return this.settings[key].value;
      } else {
        return null;
      }
    });
    exportsObject.push = Object.freeze(function(key, value, isMute=true){
      let logText = "";
      switch(units.getTypeOfObject(exportsObject.get(key))){
        case "array":
          exportsObject.settings[key].push(value);
          break;
        case "null":
          exportsObject.settings[key] = [value];
          break;
        case "undefined":
          exportsObject.settings[key] = [value];
          break;
        default:
          break;
      }
      if(!isMute){
        console.log(logText);
      }
    });
  }
}

const end = function(){
  process.exit(0);
}

confirmLanguageInfo();

const exportsObject = { end, log, units, main };
const myModule = { settingInfo, ignoreFiles, argOptionData, main, efs, setSetting, units, clasp, readLine, end, log };
setExportObject(exportsObject, myModule);
module.exports = exportsObject;
