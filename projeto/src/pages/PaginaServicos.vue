<template>
  <router-link v-if="existePosto == false" :to="'/:notFound(.*)'"></router-link>
  <div class="page-template">
    <Navbar />
    <div class="main">
      <aside class="left">
        <p class="nome_Posto">Posto #{{this.id}}</p>
        <div style="padding-left: 6mm; padding-top: 7mm">
          <button v-for="(tiposervico, index) in tipoServico" :key="index" class="botao_Tipo">
            <div class="icon_Nome">
              <img
                :src="getIconPath(tiposervico)"
                style="padding-right: 2mm"
              />
              <span>{{tiposervico}}</span>
            </div>
          </button>
        </div>
      </aside>
      <main>
        <div class="filtros">
          <button class="botao_filtra" @click="filtroSelecionado = 'todos'">Todos os serviços</button>
          <button class="botao_filtra" @click="filtroSelecionado = 'programados'">Programados</button>
          <button class="botao_filtra" @click="filtroSelecionado = 'nao_programados'">Não programados</button>
          <button class="botao_filtra" @click="filtroSelecionado = 'suspensos'">Suspensos</button>
        </div> 

          <div v-if="filtroServicos.length === 0" class="sem-servicos">
            Não há serviços atribuídos!
          </div>
          <div class="card-container">
                <div class="card" v-for="servico in filtroServicos" :key="servico[0]">             
                 <div v-if="servico[1] === 'nao_programados'">
                  <router-link :to="`/servico/${servico[0]}`" class="card-link">
                    <div class="card-content">
                      <!-- LADO ESQUERDO DO CARD -->
                      <div class="left-column">
                        <div class="top-left">{{servico[2]}}</div>
                      </div>
                      <!-- LADO DIREITO DO CARD -->
                      <div class="right-column">
                        <!-- LADO DIREITO SUPERIOR DO CARD -->
                        <div class="top-right">
                          <button class="botao_Tipo">
                            <img :src="getIconPath(servico[4])" style="padding-right: 2mm;">
                            <span>{{servico[4]}}</span>
                          </button>
                        </div>
                        <!-- LADO DIREITO INFERIOR DO CARD -->
                        <div class="bottom-right">
                          <img src="@/assets/iconClock.png" alt="iconClock" style="padding-right: 10%;">
                          <p>{{servico[3]}}min</p> <!-- Mostra a duração do serviço -->
                        </div>
                      </div>
                    </div>
                  </router-link>
                  </div>
                  <div v-else-if="servico[1] === 'programados'">
                    <router-link :to="`/servico/${servico[0]}`" class="card-link">
                    <div class="card-content">
                      <!-- LADO ESQUERDO DO CARD -->
                      <div class="left-column">
                        <div class="top-left">{{servico[2]}}</div>
                        <div class="bottom-left">{{servico[5]}}h</div>
                      </div>
                      <!-- LADO DIREITO DO CARD -->
                      <div class="right-column">
                        <!-- LADO DIREITO SUPERIOR DO CARD -->
                        <div class="top-right">
                          <button class="botao_Tipo">
                            <img :src="getIconPath(servico[4])" style="padding-right: 2mm;">
                            <span>{{servico[4]}}</span>
                          </button>
                        </div>
                        <!-- LADO DIREITO INFERIOR DO CARD -->
                        <div class="bottom-right">
                          <img src="@/assets/iconClock.png" alt="iconClock" style="padding-right: 10%;">
                          <p>{{servico[3]}}min</p> <!-- Mostra a duração do serviço -->
                        </div>
                      </div>
                    </div>
                  </router-link>
                  </div>
                  <div v-else-if="servico[1] === 'suspensos'" >
                    <router-link :to="`/servico/${servico[0]}`" class="card-link" style="background-color: #90999E;">
                    <div class="card-content">
                      <!-- LADO ESQUERDO DO CARD -->
                      <div class="left-column">
                        <div class="top-left">{{servico[2]}}</div>
                        <div class="bottom-left" style="color: #3E608C; font-size: 32px;">Suspenso</div>
                      </div>
                      <!-- LADO DIREITO DO CARD -->
                      <div class="right-column">
                        <!-- LADO DIREITO SUPERIOR DO CARD -->
                        <div class="top-right">
                          <button class="botao_Tipo">
                            <img :src="getIconPath(servico[4])" style="padding-right: 2mm;">
                            <span>{{servico[4]}}</span>
                          </button>
                        </div>
                        <!-- LADO DIREITO INFERIOR DO CARD -->
                        <div class="bottom-right">
                          <img src="@/assets/iconClock.png" alt="iconClock" style="padding-right: 10%;">
                          <p>{{servico[3]}}min</p> <!-- Mostra a duração do serviço -->
                        </div>
                      </div>
                    </div>
                  </router-link>
                  </div>
                </div>

          </div>
      </main>
    </div>
  </div>
</template>

<script  src="./PaginaServicos/PaginaServicos.script.js"> 
  import Navbar from "../components/Navbar.vue";
</script>



<style src="./PaginaServicos/PaginaServicos.style.css"></style>