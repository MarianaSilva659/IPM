<script>
import Erro from './PopUp_Erro.vue'

export default {
    components:{
        Erro
    },
  name: 'PhCaretDownBold',
  props: {
        idServico: {
            type: String,
            required: true
        },
        tipoMotor:{
            type:String,
            default: 'Gasolina',
            required:true
        }
    },
  data(){
    return{
        mostrarConfirmacao: false,
        aberto: false,
        exibirErro: false,
        servicosPossiveis:[],
        selecionados:[],
        //tipoMotor: 'Gasolina' //alterar com store mas para já serve de teste
    }
  },
  methods:{
    abrir(){
        this.aberto = !this.aberto;
    },
    verificarSugestao() {
        if (this.selecionados.length == 0) {
            this.exibirPopupErro('É necessário selecionar pelo menos um serviço para submeter a recomendação!');
        } else {
            this.mostrarConfirmacao = true;
        }
    },
    exibirPopupErro(mensagem) {
        this.mensagemErro = mensagem;
        this.exibirErro = true;
    },
    getIconPath(servico) {
      return `/src/assets/icon${servico}.png`;
    },
    getServicos(){
        fetch('http://localhost:3000/vehicle-types')
            .then(response => {
                if(response.ok){
                    return response.json();
                }else{
                    throw new Error('Something went wrong');
                }
            })
            .then(vehicleTypes =>{
                vehicleTypes.forEach(tipos =>{
                    if(tipos.id === this.tipoMotor){
                        const servicos = tipos.serviços;
                        fetch('http://localhost:3000/service-definitions')
                            .then(response => {
                                if(response.ok){
                                    return response.json();
                                }else{
                                    throw new Error('Something went wrong');
                                }
                            })
                            .then(definicaoServicos =>{
                                definicaoServicos.forEach(servico =>{
                                    if(servicos.includes(servico.id)){
                                        this.servicosPossiveis.push({
                                        id: servico.id,
                                        descricao: servico.descr,
                                        tipo: tipos.id,
                                        ativo: false
                                        })
                                    }
                                });
                            })
                            .catch(error => console.log(error));
                    }
                })

            })
            .catch(error => console.log(error));
    },
    addSelecionados(servico){
        if(!this.selecionados.includes(servico)){
            servico.ativo = true;
            this.selecionados.push(servico);
            console.log(this.selecionados);
        }
        else{
            this.removeSelecionados(servico);
        }
    },
    removeSelecionados(servico){
        const index = this.selecionados.indexOf(servico);
        if (index !== -1) {
            this.selecionados.splice(index, 1);
            servico.ativo = false;
        }
    },
    async adicionarRecomendacoes(){
        let descrRecomendacao = [];
        for (const servico of this.selecionados){
            descrRecomendacao.push(servico.descricao);
        }
        const urlS = `http://localhost:3000/services/${this.idServico}`;
                    const optionsS = {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ recomendação: descrRecomendacao})
                    };
                    try {
                        const response = await fetch(urlS, optionsS);
                        if (!response.ok) {
                            this.$router.push('/:notFound(.*)');
                            throw new Error('Erro ao recomendar o serviço aceite para o mecânico');
                        }
                        console.log('Serviço com recomendação!');
                    } catch (error) {
                        this.$router.push('/:notFound(.*)');
                        console.error(error);
                    }
                    this.$emit('recomendacaoFeita');
    },
    afinalNaoQuero(){
        this.$emit('recomendacaoFeita');
    }
  },
  computed:{
    numSelecionados(){
        return this.selecionados.length === 0;
    }
  },
  created(){
    this.getServicos();
  }
}

</script>

<template>
    <div class="sugestao">
        <div class="sugestao-conteudo">
            <p>Gostava de recomendar serviços para este veículo?</p>
            <div class="custom-select" :class="{open: aberto}"> 
                <div class="select-box"  @click="abrir">
                    <div class="selected-options">
                        <!--caso nao tenha nada na lista de escolhidos, aparece a mensagem: Selecione o(s) serviço(s)-->
                        <div v-show="numSelecionados" class="no-selected">
                            Selecione o(s) serviço(s)
                        </div>
                        <!--caso tenha algo, aparece em tags-->
                        <span class="tag" v-for="selecionado in selecionados">
                            {{ selecionado.descricao }}
                            <span class="remove-tag" @click.stop="removeSelecionados(selecionado)">&times;</span>
                        </span>

                        
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 256 256"><path fill="#90999E" d="m216.49 104.49l-80 80a12 12 0 0 1-17 0l-80-80a12 12 0 0 1 17-17L128 159l71.51-71.52a12 12 0 0 1 17 17Z"></path></svg>
                </div>
                
                <div class="options">
                    <div class="option" v-for="opcao in servicosPossiveis" :key="opcao.id" :value="opcao.descricao" :class="{active: opcao.ativo}" @click="addSelecionados(opcao)">
                        {{ opcao.descricao }}
                        <div class="botao_tipo">
                            <img :src="getIconPath(opcao.tipo)" style="padding-right: 2mm;  width: 1.8em; height: 1.4em;">
                            <span>{{ opcao.tipo }}</span>
                        </div>
                    </div>
                </div>
            </div>


            <div v-if="mostrarConfirmacao" class="confirmacao">
                <p>Tem a certeza que quer submeter esta mensagem de suspensão?</p>
                <button @click="adicionarRecomendacoes" class="sim_nao">Sim</button>
                <button @click="mostrarConfirmacao = false" class="sim_nao">Não</button>
            </div>
            <div v-else class="escolha">
                <button  @click="verificarSugestao">Submeter</button>
                <button @click="afinalNaoQuero">Não, obrigado</button>
            </div>
            
        </div>
        <Erro :mensagem="mensagemErro" :exibir="exibirErro" @fechar="exibirErro = false" />
    </div>

</template>



<style scoped>
.sugestao{
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

.sugestao-conteudo{
    background-color: #9BBEEC;
    padding: 50px 50px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    gap: 40px;
}

.escolha{
    display: flex;
    flex-direction: row-reverse;
    gap: 20px;
}

select{
    padding: 10px 20px;
    font-size:1em;
    font-weight: 600;
    cursor:pointer;
}

p{
    font-weight: 600;
    font-size: 1.5em;
    margin: 0;
}

button{
    margin-top: 10px;
    display: flex;
    flex-direction: row-reverse;
    font-size:20px;
    background: none;
    border: none;
    font-weight: 600;
    color: #5d6367;
}

button:hover{
    cursor:pointer;
    color: #6F7273;
}

.custom-select{
    position: relative;
    
}

.select-box{
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    justify-content:space-between;
    align-items: center;
    padding: 0 15px;
    height: 60px;
    cursor: pointer;
}

.no-selected{
    font-size:1.2em;
    font-weight: 600;
    color: #90999E;
}

.selected-options{
    display:flex;
    flex-wrap:wrap;
    margin-top:0;
}

.tag{
    background-color: #BFC6C7;
    border-radius: 5px;
    margin-right: 5px;
    padding:6px 14px;
    display: flex;
    align-items: center;
}

.remove-tag{
    margin-left:6px;
    cursor:pointer;
}

.arrow{
    margin:0 10px;
}

svg:hover path{
    fill: #6F7273;
}

.options{
    display: none;
    position: absolute; 
    width:100%;
    background-color: #fff;
    border: 1px solid #6F7273;
    border-radius:0 0 5px 5px;
    border-top:none;
    max-height: 200px;
    overflow-y: auto;
    z-index:1;
    box-shadow:0px 4px 8px rgba(0,0,0,0.1);
}

.open .options{
    display:block;
}

.option{
    padding: 10px 15px;
    cursor: pointer;
    border-bottom: 1px solid #BFC6C7;
    font-size:1.1em;
    font-weight: 600;
    display:flex;
    justify-content: space-between;
    align-items: center;
}

.option.active{
    background-color: #BFC6C7;
}

.botao_tipo {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9em;
  color: black;
  background-color: #4886d9;
  border: none;
  border-radius: 20px;
  padding: 10px 10px;
}


.tag:hover, .option:hover{
    background-color: #90999E;
}


/*para confirmacao*/
.confirmacao{
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 630px;
}

.confirmacao p{
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
color:#000;
display: flex;
align-items: center;
border: none;
border-radius: 20px;
padding: 0.7em 1.5em;
justify-content: center;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.sim_nao:hover{
    color:#000;
    background-color: #90999E;
}

</style>