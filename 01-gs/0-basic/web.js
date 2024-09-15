function doGet() {
  const title = "";

  const cdnUrls = [
    "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js", // 必須
    "https://unpkg.com/vue@3/dist/vue.global.js",                       // 必須
    // ↓ 競合関係に気を付けつつ好きなCDNを入れてください。
  ];
  const stylesheetFileNameList = [
    // ↓ 07-sytlesheetフォルダ内の必要なファイルの名前を拡張子無しで追加してください。
    "main"
  ];
  const classFileNameList = [
    "displayMessage", // 必須。一番上に持ってくるべし。
    "vue"    // 必須
    // ↓ 04-jsClassフォルダ内の必要なファイルの名前を拡張子無しで追加してください。
  ];
  const prevJsFileNameList = [
    // ↓ 06-js/0-previousフォルダ内の必要なファイルの名前を拡張子無しで追加してください。
  ];
  const vueFileNameList = [
    // ↓ 05-jsClassフォルダ内の必要なファイルの名前を拡張子無しで追加してください。
  ];
  const followingJsFileNameList = [
    // ↓ 06-js/1-followingフォルダ内の必要なファイルの名前を拡張子無しで追加してください。
  ];
  let classHtml = "";
  for(const classFileName of classFileNameList){
    const fileName = `04-jsClass/${classFileName}`;
    if(classFileName == "displayMessage"){
      classHtml += `<script id="display-message-class">${"\n"}${getContentFromFile(fileName)}${"\n"}</script>${"\n"}`;
    } else{
      classHtml += `<script>${"\n"}${getContentFromFile(fileName)}${"\n"}</script>${"\n"}`;
    }
  }
  let prevJsHtml = "";
  for(const prevJsFileName of prevJsFileNameList){
    const fileName = `06-js/0-previous/${prevJsFileName}`;
    prevJsHtml += `<script>${"\n"}${getContentFromFile(fileName)}${"\n"}</script>${"\n"}`;
  }
  let vueHtml = "";
  for(const vueFileName of vueFileNameList){
    const fileName = `05-vue/${vueFileName}`;
    vueHtml += `<script>${"\n"}${getContentFromFile(fileName)}${"\n"}</script>${"\n"}`;
  }
  let followingJsHtml = "";
  for(const followingJsFileName of followingJsFileNameList){
    const fileName = `06-js/1-following/${followingJsFileName}`;
    followingJsHtml += `<script>${"\n"}${getContentFromFile(fileName)}${"\n"}</script>${"\n"}`
  }
  let content = "<!DOCTYPE html>\n<head>\n  <base target='_top'>\n%stylesheets%\n%cdns%\n  <script>\n    const { createApp } = Vue\n  </script>\n</head>\n".replace("%stylesheets%", stylesheetFileNameList.map( (x) => `  <style>${"\n"}${getContentFromFile(`07-stylesheet/${x}`)}${"\n"}  </style>` ).join("\n")).replace("%cdns%", cdnUrls.map( (x) => `  <script src="${x}"></script>` ).join("\n"));
  const body = getContentFromFile("03-htmlBody/index");
  for(const row of body.split("\n")){
    if(row.includes("</body>")){
      content += classHtml;
      content += row;
    } else{
      content += (row + "\n");
    }
  }

  return HtmlService.createHtmlOutput(content).setTitle(title);
}

function getContentFromFile(fileName){
  console.log(fileName);
  const content = HtmlService.createHtmlOutputFromFile(fileName).getContent();
  return content.endsWith("\n") ? content.slice(0, -1) : content;
}