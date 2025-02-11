<template>
  <div class="geral">
    <div class="login-logo">
      <img src="@/assets/ESIDEALlogo.png" alt="Logo" >
      <span id="error_message">{{ error_message }}</span> 
    </div>
         <form name="login-items" class="form">
         <input id="ID" type="text" v-model="ID" @input="updateID($event.target.value)"  placeholder="ID do funcionário">
         <input id="Password" type="password" v-model="password" @input="updatePassword($event.target.value)" placeholder="Password"> 
         <button type="button" @click="login" @submit="login()" class="login_button">Login</button>    
      </form> 
    </div>
    
</template>

<script>
import axios from 'axios';
export default {
data() {
  return {
    ID: '',
    password: '',
    error_message: '',
  };
},methods:{
  updateID(value) {
    console.log("id",this.ID);
      this.ID = value;
    }, 
    updatePassword(value) {
      this.Password = value;
    },
    changeBoarderColor(color, id){
      const element = document.getElementById(id);

      element.style.borderColor = color;
    },
    login() {
      this.changeBoarderColor('#FFF', "Password");
      this.changeBoarderColor('#FFF', "ID");
      if (this.ID == undefined) {
        this.changeBoarderColor('#FF3434', "ID");
        this.error_message = "Identificador não existe!"
      }else {
      axios.get('http://localhost:3000/mecanicos/' + this.ID).then(response => {
        if (response.data.password == this.Password) {
          this.$globalState.posto = response.data.posto;
          this.$globalState.mecanicoID = this.ID;
          if(response.data.servicoARealizar == "" || !response.data.servicoARealizar){
            this.$router.push('/paginaServicos/' + response.data.posto);
          }else {
            this.$router.push('/servico/' + response.data.servicoARealizar);
          }
        }else{
          this.changeBoarderColor('#FF3434', "Password");
          this.error_message = "Dados de autenticação inválidos!"
        }
      }).catch(error => {
        console.error(error.message);
        this.changeBoarderColor('#FF3434', "ID");
        this.error_message = "Identificador não existe!"
      })
    }
  }
}
};
</script>



<style scoped>
.geral {
  background-color: #F0F1F2;
  height: 100vh;
  width: 100vw;
}

.login-logo img {
  display: flex;
  width: 48vw;
  height: auto;
  margin: 0 auto;
  z-index: 1;
}

.login-logo span{
  display: flex;
  color: #FF3434;
  margin-left: 36.75vw;
  font-weight: bold;
  font-size: 1rem;
  z-index: 2;
}

.form{
  width: 26.5vw;
  height: auto;
  margin: 0 auto;
}

.form input {
  width: 100%;
  height: 100%;
  margin-bottom: 2%;
  color: #000;
  background: #fff;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: .2s ease-in;
  border: 2px solid #fff;
  padding: 2%;
}

.form input::placeholder{
  color: #9BBEEC;
}

.form input:hover,
.form input:focus {
  box-shadow: 0px 0px 0px 7px rgb(74, 157, 236, 5%);
  background-color: white;
}


.form button {
  margin-left: 64.96%;
  display: block;
  padding: 2%;
  width: 35.04%;
  height: 83.78%;
  font-weight: bold;
  background-color: #4886D9;
  color: white;
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 0.5% 0.25% -0.375px;
  border: none;
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
}

.form button:hover {
  transform: scale(1.03);
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px;
}

.form button:active {
  transform: scale(0.95);
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 15px 10px -10px;
}
</style>