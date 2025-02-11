<script>
import Back from '../components/ui/Back.vue'
import Button from '../components/ui/Button.vue'
import Navbar from '@/components/Navbar.vue'
import Suspender from '@/components/ui/Suspender.vue'
import Sugestao from '@/components/ui/Sugestao.vue'
import Sucesso from '@/components/Sucesso.vue'

export default{
    components:{
        Back,
        Navbar,
        Button,
        Suspender,
        Sugestao,
        Sucesso
    },
    props: ['id'],
    data() {
        return {
            mostrarConfirmacao: false,
            acaoServico: null,
            informacaoCliente: [],
            informacaoVeiculo: [],
            informacaoServico: [],
            agendamentoServico: null,
            temRecomendacao: false,
            estadoServico: null,
            aRealizar: false,
            podeVoltarATras: true,
            popUpSuspender: false,
            popUpSugestao: false,
            mostrarFinalizacao: false,
            mostrarPopupSucesso: false
        };
    },
    methods: {
        async finalizarServicoSim() {
            let p;

            const url = `http://localhost:3000/services/${this.id}`;
            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ estado: "realizado"})
            };
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    this.$router.push('/:notFound(.*)');
                    throw new Error('Erro ao atualizar o estado do serviço');                }
                console.log('Estado do serviço atualizado com sucesso!');            
            } catch (error) {
                this.$router.push('/:notFound(.*)');
                console.error(error);
            }
            const urlM = `http://localhost:3000/mecanicos/${this.$globalState.mecanicoID}`;
            const optionsM = {
              method: 'GET', 
              headers: {
                'Content-Type': 'application/json' 
              }
            };
            
            fetch(urlM, optionsM)
              .then(response => response.json()) 
              .then(data => {

                p = data.password;
              })
              .catch(error => {
                this.$router.push('/:notFound(.*)');
                console.error('Erro ao fazer requisição 1:', error);
              });
              const url2 = `http://localhost:3000/mecanicos/${this.$globalState.mecanicoID}`;
              const options2 = {
                  method: 'PATCH',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ servicoARealizar: ""})
              };
              try {
                  const response = await fetch(url2, options2);
                  if (!response.ok) {
                    this.$router.push('/:notFound(.*)');
                    throw new Error('Erro ao atualizar o serviço aceite para o mecânico');
                  }
                  console.log('Serviço aceite atualizado com sucesso!');
              } catch (error) {
                this.$router.push('/:notFound(.*)');
                  console.error(error);
              }
              this.mostrarFinalizacao = false;
            
        },
        suspenderServico() {
            this.popUpSuspender = true;
        },
        adicionarServico() {
            this.popUpSugestao = true;
            // Lógica para adicionar serviço extra
        },
        async confirmarAcao(acao){
            this.podeVoltarATras = false;
            this.mostrarConfirmacao = false;
            this.acaoServico = acao;
            const url = `http://localhost:3000/mecanicos/${this.$globalState.mecanicoID}`;
            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ servicoARealizar: this.id})
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
            const urlS = `http://localhost:3000/services/${this.id}`;
            const optionsS = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ estado: "arealizar"})
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
        },
        cancelarServico(Finalizado){
            this.mostrarConfirmacao = false;
            this.aRealizar = false;
        },
        cancelarServicoFinalizado(){
            this.mostrarFinalizacao = false;
        },
        async getEspecificacao() {
            try {
                //INFORMAÇÃO SERVIÇO
                const responseServico = await fetch('http://localhost:3000/services/' + this.id);
                if (!responseServico.ok) {
                    this.$router.push('/:notFound(.*)');
                  throw new Error('Something went wrong 1');
                }
                const dataServico = await responseServico.json();
                this.informacaoServico.push(dataServico.descrição);
                this.informacaoVeiculo.push(dataServico.vehicleId);
                const responseServicoNome = await fetch('http://localhost:3000/service-definitions/' + dataServico['service-definitionId']);
                if (!responseServicoNome.ok) {
                    this.$router.push('/:notFound(.*)');
                    throw new Error('ERRO NO FETCH service-definitions');
                }
                const dataServicoNome = await responseServicoNome.json();
                this.informacaoServico.push(dataServicoNome.descr);
                this.informacaoServico.push(dataServicoNome.duração);
                if(dataServico.agendamento == "filaDeEspera" && dataServico.estado != "suspenso"){
                    this.agendamentoServico = 'Fila de Espera';
                    if(dataServico.estado == "arealizar"){
                        this.aRealizar = true;
                        this.podeVoltarATras = false;
                    }
                }else if(dataServico.agendamento == "programado" && dataServico.estado != "suspenso"){
                    this.agendamentoServico = 'Programado';
                    let dataString = `${dataServico.data.dia}/${dataServico.data.mes}/${dataServico.data.ano} ${dataServico.data.hora}:${dataServico.data.minutos}`;
                    this.informacaoServico.push(dataString);
                    if(dataServico.estado == "arealizar"){
                        this.aRealizar = true;
                        this.podeVoltarATras = false;
                    }
                }else if(dataServico.estado == "suspenso" && dataServico.agendamento == "filaDeEspera"){
                    this.estadoServico = "Suspenso";
                    this.agendamentoServico = 'Fila de Espera';
                }else if(dataServico.estado == "suspenso" && dataServico.agendamento == "programado"){
                    this.estadoServico = "Suspenso";
                    this.agendamentoServico = 'Programado';
                }


                if(dataServico.recomendação){
                    this.temRecomendacao = true;
                    this.informacaoServico.push(dataServico.recomendação);
                }
                //INFORMAÇÃO VEÍCULO
                const responseVehicle = await fetch('http://localhost:3000/vehicles/' + dataServico.vehicleId);
                if (!responseVehicle.ok) {
                    this.$router.push('/:notFound(.*)');
                  throw new Error('Something went wrong 2');
                }
                const dataTipoVeiculo = await responseVehicle.json();
                this.informacaoVeiculo.push(dataTipoVeiculo['vehicle-typeId']);
                this.informacaoVeiculo.push(dataTipoVeiculo.kms);
                this.informacaoVeiculo.push(dataTipoVeiculo.cilindrada);
                if(dataTipoVeiculo['vehicle-typeId'] == "Elétrico" || dataTipoVeiculo['vehicle-typeId'] == "Híbrido"){
                    this.informacaoVeiculo.push(dataTipoVeiculo.potencia);
                }

                //INFORMAÇÃO CLIENTE
                const responseCliente = await fetch('http://localhost:3000/clients/' + dataTipoVeiculo.clientId);
                if (!responseCliente.ok) {
                    this.$router.push('/:notFound(.*)');
                  throw new Error('Something went wrong 3');
                }
                const dataCliente = await responseCliente.json();
                this.informacaoCliente.push(dataCliente.nome);
                this.informacaoCliente.push(dataCliente.telefone);
                this.informacaoCliente.push(dataCliente.email);


            } catch (error){
                this.$router.push('/:notFound(.*)');
                    console.log(error);
                }
        },
        getIDPosto(){
        return '/paginaServicos/' + this.$globalState.posto;
        },
        voltarPopUpSuspensao(){
            this.popUpSuspender = false;
        },
        voltarPopUpSugestao() {
            this.popUpSugestao = false;
            this.mostrarPopupSucesso = true;
            setTimeout(() => {
                this.mostrarPopupSucesso = false;
            }, 2000); // 3 segundos
        },
        finalizarServico(){
            this.mostrarFinalizacao = true;
            console.log("aquuu", this.mostrarFinalizacao === true)
        }
    },
    mounted() {
    this.getEspecificacao();
  }
}


</script>

<template>
    <Navbar /> 
    <div class="geral">
        <Back v-if="podeVoltarATras" :id="this.$globalState.posto" pag="paginaServicos"/>
        <h1>Especificação do Serviço</h1>
        <div class="infos">
            <!--Cliente-->
            <div class="caixa">
                <div class="titulo">Cliente</div>
                <div class="item-caixa">Nome: <span style="font-size: 18px;">{{ this.informacaoCliente[0] }}</span></div>
                <div class="item-caixa">Telemóvel: <span style="font-size: 18px;">{{ this.informacaoCliente[1] }}</span></div>
                <div class="item-caixa">Email: <span style="font-size: 18px;">{{ this.informacaoCliente[2] }}</span></div>
            </div>
            <div class="double-height">
                <!--Serviço-->
                <div class="caixa">
                    <div v-if="estadoServico != 'Suspenso'" class="titulo">Serviço a Realizar</div>
                    <div v-if="estadoServico == 'Suspenso'" class="titulo">Serviço <span style="color: black;">Suspenso!!</span></div>
                    <div class="item-caixa">Tipo de Serviço: <span style="font-size: 18px;">{{ this.informacaoServico[1] }}</span></div>
                    <div v-if="estadoServico == 'Suspenso'" class="item-caixa altura-fi">Descrição do Motivo: <span style="font-size: 18px;">{{ this.informacaoServico[0] }}</span></div>
                    <div v-else class="item-caixa altura-fi">Descrição: <span style="font-size: 18px;">{{ this.informacaoServico[0] }}</span></div>
                    <div class="item-caixa">Agendamento: <span style="font-size: 18px;">{{ this.agendamentoServico }}</span></div>
                    <div class="item-caixa">Duração: <span style="font-size: 18px;">{{ this.informacaoServico[2] }}min</span></div>
                    <div v-if="agendamentoServico == 'Programado'" class="item-caixa">Data e Horas: <span style="font-size: 18px;">{{ informacaoServico[3] }}h</span></div>
                    <div v-else-if="agendamentoServico == 'Fila de Espera'" class="item-caixa">Data e Horas: <span style="font-size: 18px;">---------------</span></div>
                    <div v-if="temRecomendacao" class="item-caixa">Recomendações de Serviços: 
                                            <ul>                                                
                                                <li v-if="agendamentoServico === 'Programado'" v-for="(info, index) in informacaoServico[4]" :key="index">
                                                    <span style="font-size: 18px;">
                                                        {{info}}
                                                    </span>
                                                </li>
                                                <li v-else-if="agendamentoServico == 'Fila de Espera'" v-for="(info, index1) in informacaoServico[3]" :key="index1">
                                                    <span style="font-size: 18px;">
                                                        {{info}}
                                                    </span>
                                                </li>                     
                                            </ul>
                    </div>
                </div>
                <!--ESTADOS-->
                <!--Confirmação-->
                <div v-if="mostrarConfirmacao" class="confirmacao">
                    <p>Tem a certeza que quer aceitar o serviço?</p>
                    <div class="butoes">
                        <Button @click="confirmarAcao('realizar')">Sim</Button>
                        <Button @click="cancelarServico">Não</Button>
                    </div>
                </div>
                <!--Confirmar Finalização-->
                
                <div v-if="mostrarFinalizacao" class="confirmacao">
                    <p>Tem a certeza que quer finalizar o serviço?</p>
                    <div class="butoes">
                        <router-link :to="getIDPosto()" class="alto" style="text-decoration: none;"> 
                        <Button @click="finalizarServicoSim">Sim</Button>
                    </router-link>

                        <Button @click="cancelarServicoFinalizado">Não</Button>
                    </div>
                </div>
                <!--Serviço a decorrer-->
                <div v-else-if="(acaoServico === 'realizar') && (aRealizar)" class="aDecorrer">
                        <Button class="alto" @click="finalizarServico">Finalizar Serviço</Button>
                    <button class="butao_estreito" @click="suspenderServico">Suspender</button>
                    <Suspender v-if="popUpSuspender" :idServico="this.id" v-on:voltar="voltarPopUpSuspensao"/>
                    <button class="butao_estreito" @click="adicionarServico">Adicionar Serviço Extra</button>
                    <Sugestao v-if="popUpSugestao" :idServico="this.id" :tipoMotor="this.informacaoVeiculo[1]" v-on:recomendacaoFeita="voltarPopUpSugestao"/>
                    <Sucesso v-if="mostrarPopupSucesso">Serviço Recomendado!</Sucesso>
                </div>
                <!--Realizar Serviço-->
                <div v-else-if="!aRealizar" class="butoes">
                    <Button @click="mostrarConfirmacao = true; aRealizar = true">Realizar Serviço</Button>
                </div>
            </div>
            <!--Veículo-->
            <div class="caixa">
                <div class="titulo">Veículo</div>
                <div class="item-caixa">Matrícula: <span style="font-size: 18px;">{{ informacaoVeiculo[0] }}</span></div>
                <div class="item-caixa">Tipo de Motor: <span style="font-size: 18px;">{{ informacaoVeiculo[1] }}</span></div>
                <div class="item-caixa">Kms: <span style="font-size: 18px;">{{ informacaoVeiculo[2] }} km</span></div>
                <div v-if="informacaoVeiculo[1] == 'Híbrido' || informacaoVeiculo[1] == 'Elétrico'" class="item-caixa">Potência do Carregador: <span style="font-size: 18px;">{{ informacaoVeiculo[4] }} kW</span></div>
                <div v-if="informacaoVeiculo[1] != 'Elétrico'" class="item-caixa">Cilindrada: <span style="font-size: 18px;">{{ this.informacaoVeiculo[3] }} cc</span></div>
            </div>
        </div>
    </div>
</template>


<style scoped>
.geral{
    margin:30px 50px;
}

.infos{
    display:grid;
    grid-template-columns: repeat(2,1fr);
    gap: 40px;
}

.caixa{
    border: solid #3E608C;
    border-radius: 20px;
    margin-left:10px;
    margin-right:10px;
    margin-top: 10px;
}

.titulo{
    background-color: #4886D9;
    padding: 20px;
    font-weight: 600;
    font-size: 1.5em;
    border-radius: 15px 15px 0px 0px;

}

.item-caixa{
    border-top: solid #3E608C;
    padding: 15px;
    font-weight: 500;
    font-size: large;
}

.double-height{ 
    grid-row-start: span 2;
    display: flex;
    flex-direction: column;
    gap: 50px;  
}

.butoes{
    display: flex;
    justify-content: center;
    gap: 5%;
}

.confirmacao{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap:10%;
}

.confirmacao p{
    font-weight: 600;
    font-size: 1.5em;
    margin: 0;
}

.aDecorrer{
    margin-left:5%;
    margin-right:5%;
    display:grid;
    grid-template-columns: auto auto;
    grid-template-areas:"f s" "f e";
    gap: 10px;
}

.alto{ 
    grid-area: f;
}

.butao_estreito{
cursor: pointer;
font-weight: 600;
font-size: 1.1em;
outline: none;
background-color: #BFC6C7;
display: flex;
align-items: center;
border: none;
border-radius: 20px;
padding: 0.5em 1em;
justify-content: center;
box-shadow: 0 10px 16px rgba(255, 255, 255, 0.2);
}

.butao_estreito:hover{
    background-color: #90999E;
}

</style>
