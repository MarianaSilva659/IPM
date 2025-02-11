<script>
import Back from './BackPopUp.vue';
import Button from './Button.vue';
import Erro from '../ui/PopUp_Erro.vue'

export default{
    components:{
        Back,
        Button,
        Erro
    },
    props: {
        idServico: {
            type: String,
            required: true
        }
    },
    data(){
        return{
            aSubmeter: false,
            motivoSuspensao: '',
            exibirErro: false,
            mensagemErro: ''
        };
    },
    methods:{
        async verificarMotivo(acao) {
            if (!this.motivoSuspensao.trim()) {
                this.exibirPopupErro('É necessária uma mensagem não vazia para submeter a suspensão!');
            } else {
                this.aSubmeter = true;
                if(acao == "Sim"){
                    const url = `http://localhost:3000/mecanicos/${this.$globalState.mecanicoID}`;
                    const options = {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ servicoARealizar: ""})
                    };
                    try {
                        const response = await fetch(url, options);
                        if (!response.ok) {
                            this.$router.push('/:notFound(.*)');
                            throw new Error('Erro ao atualizar o serviço aceite para o mecânico');
                        }
                        console.log('Serviço aceite atualizado com sucesso!');
                    } catch (error) {
                        this.$router.push('/:notFound(.*)');
                        console.error(error);
                    }
                    const urlS = `http://localhost:3000/services/${this.idServico}`;
                    const optionsS = {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ descrição: this.motivoSuspensao.trim(), 
                                                estado: "suspenso"
                                            })
                    };
                    try {
                        const response = await fetch(urlS, optionsS);
                        if (!response.ok) {
                            this.$router.push('/:notFound(.*)');
                            throw new Error('Erro ao atualizar o serviço aceite para o mecânico');
                        }
                        console.log('Serviço aceite atualizado!');
                    } catch (error) {
                        this.$router.push('/:notFound(.*)');
                        console.error(error);
                    }
                    this.$router.push('/paginaServicos/' + this.$globalState.posto);
                }
            }
        },
        exibirPopupErro(mensagem) {
            this.mensagemErro = mensagem;
            this.exibirErro = true;
        },
        respostaPopUpErro(){
            this.exibirErro = false;
        },
        voltarAoServico(){
            this.$emit('voltar');
        }
    }
    
}
</script>

<template>
    <div class="popup">
        <div class="popup-conteudo">
            <Back @click="voltarAoServico"/>
            <div class="conteudo">
                <p>Motivo para suspender:</p>
                <textarea class="motivo" v-model="motivoSuspensao" placeholder="Escreva aqui o motivo."></textarea>
                <!--Submeter-->
                <div v-if="aSubmeter" class="confirmacao_submissao" >
                    <p>Tem a certeza que quer submeter esta mensagem de suspensão?</p>
                    <button @click="verificarMotivo('Sim')" class="sim_nao">Sim</button>
                    <button class="sim_nao">Não</button>
                </div>
                <button v-else class="submeter" @click="verificarMotivo('Submeter')">Submeter</button>
            </div>
        </div>
        <Erro v-if="exibirErro" :mensagem="mensagemErro" :exibir="exibirErro" v-on:fechar="respostaPopUpErro" />
    </div>
</template>

<style scoped>
.popup{
    position:fixed;
    top:0;
    bottom:0;
    right:0;
    left: 0;
    z-index: 99;
    background-color: rgba(0,0,0,0.2);
    display: flex;
    justify-content: center;
    align-items: center;

}

.popup-conteudo{
    background-color: #9BBEEC;
    padding: 20px 20px;
    border-radius: 20px;

}

.conteudo{
    margin: 20px 40px 10px 40px;
    display: flex;
    flex-direction: column;
    gap:15px;
}

p{
    font-weight: 600;
    font-size: 1.5em;
    margin: 0;
}

.motivo{
    height: 150px;
    width: 500px;
    padding: 15px;
    font-size: small;
}

.submeter{
    margin-top: 10px;
    display: flex;
    flex-direction: row-reverse;
    font-size:large;
    background: none;
    border: none;
    font-weight: 600;
    color: #90999E;
}


.submeter:hover{
    cursor:pointer;
    color: #6F7273;
}

.confirmacao_submissao{
    display: flex;
    gap: 10px;
    max-width: 500px;
    margin-top: 10px;
}

.confirmacao_submissao p{
    font-weight: 600;
    font-size: 1em;
    margin: 0;
    flex: 45%;
}


.sim_nao{
cursor: pointer;
font-weight: 600;
font-size: 0.9em;
outline: none;
background-color: #BFC6C7;
display: flex;
align-items: center;
border: none;
border-radius: 20px;
padding: 0.7em 1.5em;
justify-content: center;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>