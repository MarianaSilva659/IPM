<template>
  <nav class="navbar" id="nav">
    <router-link to="/">
      <img
        src="@/assets/ESIDEALlogo_white.png"
        alt="Logo"
        style="width: 121px; height: 81px; margin-right: 10px"
      />
    </router-link>
    <div class="nav-items">
      <router-link class="botao_terminar_sessao" to="/login">Terminar Sessão</router-link>
      <i class="icon_Logout"></i>
    </div>
  </nav>
</template>


<style scoped>
.icon_Nome {
  display: flex;
  align-items: center;
}

* {
  margin: 0px;
  box-sizing: border-box;
}

.icon_Logout {
  box-sizing: border-box;
  color: #fff;
  position: relative;
  display: block;
  width: 10px;
  height: 26px;
  border: 3px solid;
  transform: scale(var(--ggs, 1));
  border-right: 0;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  margin-left: -15px;
}

.icon_Logout::after,
.icon_Logout::before {
  content: "";
  display: block;
  box-sizing: border-box;
  position: absolute;
}

.icon_Logout::after {
  border-top: 3px solid;
  border-right: 3px solid;
  transform: rotate(45deg);
  width: 12px;
  height: 12px;
  left: 12px;
  bottom: 3px;
}

.icon_Logout::before {
  border-radius: 4px;
  width: 16px;
  height: 3px;
  background: currentColor;
  left: 8px;
  bottom: 8px;
}

.botao_terminar_sessao {
  color: #fff;
  font-weight: bold;
  font-size: 24px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  text-decoration: none;
}

#nav {
  display: flex;
  height: fit-content;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 10px 20px;
  background-color: #3e608c;
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
}

.nav-items {
  display: flex;
  align-items: center;
  padding-right: 30px;
}

.nav-items i {
  margin-left: 10px;
}

.nav-items:hover a,
.nav-items:hover i {
  color: #bfc6c7;
}
</style>
