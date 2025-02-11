<template>
  <button type="button">
    <slot></slot>
  </button>
</template>    

<style scoped>
button {
cursor: pointer;
font-weight: 700;
font-size: 1.5em;
outline: none;
background-color: #BFC6C7;
display: flex;
align-items: center;
border: none;
border-radius: 20px;
padding: 0.8em 2em;
justify-content: center;
box-shadow: 0 10px 16px rgba(255, 255, 255, 0.2);
}

button:hover{
background-color: #90999E;
}

</style>