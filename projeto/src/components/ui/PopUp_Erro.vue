<script>
import Back from './BackPopUp.vue';
import Button from './Button.vue';


export default{
    components:{
        Back,
    },
    props: {
        mensagem: String,
        exibir: Boolean
  },
    methods:{
        fecharErro() {
            this.$emit('fechar');
        }
    }
}
</script>

<template>
    <div class="error_popup"  v-if="exibir">
        <div class="error_popup-conteudo">
            
            <div class="conteudo">
                <p>{{ mensagem }}</p>
                <div style="display: flex; flex-direction: row-reverse;">
                    <Back @click="fecharErro"/>
                </div>
            </div>  
        </div>
    </div>
</template>

<style scoped>
.error_popup{
    position:fixed;
    top:0;
    bottom:0;
    right:0;
    left: 0;
    z-index: 150;
    background-color: rgba(0,0,0,0.2);
    display: flex;
    justify-content: center;
    align-items: center;

}


.error_popup-conteudo{
    max-width: 40%;
    background-color: #F0F1F2;
    padding: 20px 20px;
    border-radius: 20px;
    border-style: solid;
    border-width:5px;
    border-color: #ff0000;
}

.conteudo{
    margin: 10px 30px 0px 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap:20px;
}

p{
    font-weight: 600;
    font-size: 1.3em;
    margin: 0;
}

</style>