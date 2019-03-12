//数字输入组件
function financeInputHtml(){
  let html = ""
      html += "<div>"
      html +=   "<input v-model='number' ref='numbner-input'  @input='inputChange($event.target.value)' @focus='inputFocus' @blur='inputBlur' v-show='showInput' style='width:70px;' @keyup.enter='enterKey'></input>"
      html +=   "<span @click='spanClick' v-show='!showInput'>{{numberFormat}}</span>"
      html += "</div>"

  return html
}

Vue.component("finance-number-input",{
  props:{
    number:{
      type: Number,
      default: function(){
        return 0
      }
    },
    max_number:{
      type: Number,
      default: function(){
        return -1
      }
    }
  },

  data: function(){
    return {
      showInput: false,

    }
  },
  computed: {
    numberFormat(){
      return Number(this.number).toFixed(2)
    }
  },
  methods: {
    inputFocus(){
     
    },
    inputBlur(){
       this.showInput = false
       this.$emit("number-blur", this.number)
    },
    inputChange(value){
      if(!this.checkNumber(value) && value.substring(value.length -1) != "."){
        this.number = value.substring(0, value.length -1)
      }
      if(this.max_number != -1 && this.number > this.max_number){
        this.number = value.substring(0, value.length -1)
      }
      this.$emit("number-change", this.number)
    },
    spanClick(){
       this.showInput = true
       setTimeout(()=>{
          this.$refs["numbner-input"].focus()
        }, 0)
       
    },
    checkNumber(val){
      return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(val)
    },
    enterKey(e){
      e.target.blur()
      this.$emit("number-blur", this.number)
    }

  },
   template: financeInputHtml()
})