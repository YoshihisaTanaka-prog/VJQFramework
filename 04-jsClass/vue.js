class VueClass {
  constructor(templateFunction, object, id, editableObject = null, isNeedToMountSoom = false){
    this.object = object;
    this.object.template = templateFunction();
    this.id = "#" + id;
    this.app = {};
    this.vue = {};
  
    if(editableObject){
      const self = this;
      let func = function(object){
        for(const key of Object.keys(object)){
          self.vue.editableObject[key] = object[key];
        }
      }
  
      self.object.methods.updateFromOutside = func;
  
      let returnValue = self.object.data();
      returnValue.editableObject = editableObject;
      let dataFunctionCode = "";
      let broke = false;
      for(const line of self.object.data.toString().split("\n")){
        const words = line.split(" ");
        if( words.includes("return") ){
          for(const word of words){
            if(word == "return"){
              dataFunctionCode += "return ";
              dataFunctionCode += JSON.stringify(returnValue);
              dataFunctionCode += ";\n}";
              broke = true
              break;
            } else{
              dataFunctionCode += word;
              dataFunctionCode += " ";
            }
          }
        } else {
          dataFunctionCode += line;
          dataFunctionCode += "\n"
        }
        if(broke){
          break;
        }
      }
      dataFunctionCode = dataFunctionCode.replace("data", "function ");
      func = new Function("return " + dataFunctionCode)();
      self.object.data = func;
    }
    if(isNeedToMountSoom){
      const self = this;
      self.mount();
    }
  }
  
  mount(){
    if(Object.keys(this.app).length != 0){
      this.unmount();
    }
    this.app = createApp(this.object);
    this.vue = this.app.mount(this.id);
  }
  
  unmount(){
    this.app.unmount();
  }
  
  update(object, afterFunction = (vue) => {}){
    if(this.vue.updateFromOutside){
      this.vue.updateFromOutside(object);
      afterFunction(this.vue);
    }
  }
}