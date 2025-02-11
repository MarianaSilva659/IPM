<script>
  export default {
    name: 'PhCheckFatFill',
  }
</script>


<template>
    <div class="container" style="font-size: 1.5em; font-weight:600;">
    <div class="inner-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="5em" height="5em" viewBox="0 0 256 256">
        <path fill="#3E608C" d="m243.31 90.91l-128.4 128.4a16 16 0 0 1-22.62 0l-71.62-72a16 16 0 0 1 0-22.61l20-20a16 16 0 0 1 22.58 0L104 144.22l96.76-95.57a16 16 0 0 1 22.59 0l19.95 19.54a16 16 0 0 1 .01 22.72"></path>
      </svg>
      <slot class="mensagem"></slot>
    </div>
  </div>
</template>



<style scoped>
.container {
  position:fixed;
  top:0;
  bottom:0;
  right:0;
  left: 0;
  z-index: 99;
  background-color: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.inner-container {

  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 50px 50px;
  gap: 20px;
  display: flex; /* Adicionando display flex */
  align-items: center; /* Alinhando verticalmente */
}
.mensagem {
  display: flex;
  justify-content: center;
}
</style>