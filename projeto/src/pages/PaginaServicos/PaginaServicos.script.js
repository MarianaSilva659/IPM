
import Navbar from "../../components/Navbar.vue";

export default {
  components: {
    Navbar,
  },
  props: ['id'],
  data() {
    return {
      tipoServico: [],
      todosServicos: [[], [], []], //SERVICOS PROGRAMADOS [0] SERVICOS NÃO PROGRAMADOS [1] SERVICOS SUSPENSOS [2] 
      tiposServicosVeiculos: [[], [], [], []], //GASOLINA [0] GASOLEO [1] ELETRICO [2] HIBRIDO [3] 
      filtroSelecionado: 'todos',
      existePosto: true
    };
  },
  methods: {
    getIconPath(servico) {
      return `/src/assets/icon${servico}.png`;
    },
    async getIDServicosPosto() {
  try {
    //Para ir buscar os serviços que foram atribuídos ao posto
    const responsePosto = await fetch('http://localhost:3000/postos/' + this.id);
    if (!responsePosto.ok) {
      this.$router.push('/:notFound(.*)');
      throw new Error('Something went wrong');
    }
    const dataPosto = await responsePosto.json();
    const idservicos = dataPosto.servicos;
    //Para ir buscar detalhes dos serviços que foram atribuídos ao posto
    for (let i = 0; i < idservicos.length; i++) {
      const responseServico = await fetch('http://localhost:3000/services/' + idservicos[i]);
      if (!responseServico.ok) {
        this.$router.push('/:notFound(.*)');
        throw new Error('ERRO NO FETCH SERVICES');
      }
      const dataServico = await responseServico.json();

      if (dataServico.estado != "realizado" && dataServico.estado) {
        let informacao = [];
        informacao.push(dataServico.id);

        //Para identificar o tipo
        let estado = "";
        if (dataServico.estado === "programado") {
          estado = "programados";
        } else if (dataServico.estado === "nafila") {
          estado = "nao_programados";
        } else if (dataServico.estado === "suspenso") {
          estado = "suspensos";
        }
      
      informacao.push(estado);

        //Para ir buscar os nomes serviços que foram atribuídos ao posto
        const responseServicoNome = await fetch('http://localhost:3000/service-definitions/' + dataServico['service-definitionId']);
        if (!responseServicoNome.ok) {
          this.$router.push('/:notFound(.*)');
          throw new Error('ERRO NO FETCH service-definitions');
        }
        const dataServicoNome = await responseServicoNome.json();
        informacao.push(dataServicoNome.descr)
        informacao.push(dataServicoNome.duração)

        //Para ir buscar o tipo do carro que tem determinado serviços
        const responseVehicle = await fetch('http://localhost:3000/vehicles/' + dataServico.vehicleId);
        if (!responseVehicle.ok) {
          this.$router.push('/:notFound(.*)');
          throw new Error('Something went wrong');
        }
        const dataTipoVeiculo = await responseVehicle.json();
        informacao.push(dataTipoVeiculo['vehicle-typeId']);
        //Verifica se já existe o tipo de serviço
        if (!this.tipoServico.includes(dataTipoVeiculo['vehicle-typeId'])) {
          this.tipoServico.push(dataTipoVeiculo['vehicle-typeId']);
        }
        //DISTRIBUI OS SERVIÇOS
        if (dataServico.estado == "programado") {
          let dataString = `${dataServico.data.dia}/${dataServico.data.mes}/${dataServico.data.ano} ${dataServico.data.hora}:${dataServico.data.minutos}`;
          informacao.push(dataString);
          this.todosServicos[0].push(informacao);
        } else if (dataServico.estado == "nafila") {
          informacao.push(dataTipoVeiculo['vehicle-typeId']);
          this.todosServicos[1].push(informacao);
        } else if (dataServico.estado == "suspenso" && dataServico.agendamento == "filaDeEspera"){
          informacao.push(dataTipoVeiculo['vehicle-typeId']);
          this.todosServicos[2].push(informacao);
        }
        else if (dataServico.estado == "suspenso" && dataServico.agendamento == "programado"){
          let dataString = `${dataServico.data.dia}/${dataServico.data.mes}/${dataServico.data.ano} ${dataServico.data.hora}:${dataServico.data.minutos}`;
          informacao.push(dataString);
          this.todosServicos[2].push(informacao);
        }
      }
    }
  } catch (error) {
    this.$router.push('/:notFound(.*)');
    console.log(error);
  }
},


  },
  watch: {
    todosServicos: {
      handler(val) {
        console.log('Todos Serviços:', val);
      },
      deep: true
    },
    filtroSelecionado: {
      handler(val) {
        console.log('Todos Serviços:', val);
      },
      deep: true
    }
  },
  mounted() {
    this.getIDServicosPosto();
  },
  computed: {
  filtroServicos() {
    if (this.filtroSelecionado === 'programados') {
      return this.todosServicos[0];
    } else if (this.filtroSelecionado === 'nao_programados') {
      return this.todosServicos[1];

    } else if (this.filtroSelecionado === 'suspensos') {
      return this.todosServicos[2];

    } else {
      // Se nenhum filtro específico for selecionado, mostra todos os serviços
      const todosServicos = [].concat(...this.todosServicos);
      return todosServicos;
    }
  }
}

};
