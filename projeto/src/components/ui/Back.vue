<script>
export default {
  name: 'PhCaretLeftBold',
  props: {
        id: {
            type: String,
            required: false
        },
        pag: {
            type: String,
            required: false
        },
  },
  methods: {
    getIDPosto(){
        return '/'+ this.pag +'/' + this.id;
    }
  }
}
</script>


<template>
    <router-link :to="getIDPosto()" class="voltar"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 256 256">
            <path fill="#90999E" d="M168.49 199.51a12 12 0 0 1-17 17l-80-80a12 12 0 0 1 0-17l80-80a12 12 0 0 1 17 17L97 128Z"></path>
        </svg>
        <p>VOLTAR</p>
    </router-link>
</template>


<style scoped>
a{
    text-decoration: none;
}

.voltar{
    display:inline-flex;
    font-weight: 900;
    color: #90999E;
    align-items: center;
    font-size: 25px;
}

p{
    margin: 0;
}

.voltar:hover svg path{
    fill: #6F7273;
}

.voltar:hover p{
    color:#6F7273;
}


</style>