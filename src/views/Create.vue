<template>
  <div id="createView">
    <md-dialog :md-active.sync="showMap" :md-fullscreen="false" id="map-modal">
      <map-modal />
    </md-dialog>

    <div id="header-createView" class="md-primary">
      <h1 style="margin:0; padding-top: 4%; padding-bottom: 4%">Crea attività</h1>
    </div>
    <div id="content-createView">
      <form novalidate class="md-layout" @submit.prevent="validateActivity">
        <div class="md-layout-item md-size-50 md-small-size-100">
          <div style="padding-right:4%; padding-left: 4%;">
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <md-field :class="getValidationClass('title')">
                  <label for="titolo-attività">Titolo attività</label>
                  <md-input name="titolo-attività" id="titolo-attività" autocomplete="given-name" v-model="form.title" :disabled="sending" />
                  <span class="md-error" v-if="!$v.form.title.required">Il titolo dell'attività è necessario</span>
                  <span class="md-error" v-else-if="!$v.form.title.minlength">Titolo invalido</span>
                </md-field>
              </div>
            </div>

            <div class="md-layout md-gutter">
              <div class="md-layout-item md-medium-size-100" id="div-date" v-on:click="updateMinDatetime">
                <!-- TODO verificare questo input per la data e l'ora <input type="datetime-local"/> -->
                <md-field id="datetimeField">
                  <md-icon id="datetimeIcon">calendar_today</md-icon>
                  <label id="datetimeInputLabel" v-if="form.selectedDate === ''" for="datetimeField">Data e ora</label>
                  <datetime v-model="form.selectedDate"
                            type="datetime"
                            input-id="myInputDatetime"
                            input-style="height:100%; width:100%; font-size:16px; font-family:Avenir; padding-left:10px;"
                            hidden-name="my-datetime"
                            value-zone="Europe/Rome"
                            locale="it"
                            zone="Europe/Rome"
                            :format="{ year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit'}"
                            :phrases="{ok: 'Continua', cancel: 'Esci'}"
                            :hour-step="1"
                            :minute-step="5"
                            :min-datetime=minDatetime
                            :week-start="7"
                            v-on:close="this.updateColor"
                            required
                            auto>
                  </datetime>
                  <span class="md-error" v-if="!$v.form.selectedDate.required">Data richiesta</span>
                </md-field>
              </div>
            </div>

            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-50">
                <md-field :class="getValidationClass('category')">
                  <label for="category">Categoria</label>
                  <md-select v-model="form.category" name="category" id="category" md-dense>
                    <md-option value="1">Cinema</md-option>
                    <md-option value="2">Social</md-option>
                    <md-option value="3">Musica</md-option>
                    <md-option value="4">Cibo</md-option>
                    <md-option value="5">Teatro</md-option>
                    <md-option value="6">Aperitivo</md-option>
                    <md-option value="7">Cultura</md-option>
                    <md-option value="8">Sport</md-option>
                  </md-select>
                </md-field>
              </div>

              <div class="md-layout-item md-small-size-50">
                <md-field :class="getValidationClass('participants')">
                  <label for="participants">Numero di persone mancanti</label>
                  <!-- TODO Aggiungere controllo sull'impossibilità di inserire testo-->
                  <md-input type="number" v-model="form.participants" name="participants" id="participants" autocomplete="participants" :disabled="sending" />
                  <span class="md-error" v-if="!$v.form.participants.required">Il numero dei partecipanti è obbligatorio</span>
                  <span class="md-error" v-else-if="!$v.form.participants.maxlength">Invalid age</span>
                </md-field>
              </div>
            </div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <md-field :class="getValidationClass('singleImg')">
                  <label for="singleImg">Immagine</label>
                  <md-file v-model="form.singleImg" accept="image/*" name="singleImg" id="singleImg"/>
                </md-field>
              </div>
            </div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <md-field :class="getValidationClass('description')">
                  <label for="description">Descrizione</label>
                  <md-textarea v-model="form.description" maxlength="100" name="description" id="description"></md-textarea>
                  <md-icon>description</md-icon>
                  <span class="md-error" v-if="!$v.form.description.required">La descrizione è obbligatoria</span>
                </md-field>
              </div>
            </div>
            <div class="md-layout md-gutter" @click="showMap = true">
              <div class="md-layout-item md-small-size-100">
                <md-field :class="getValidationClass('address')">
                  <label for="address">Indirizzo</label>
                  <md-input v-model="form.address" name="address" id="address" :disabled="true"></md-input>
                  <div>
                    <md-icon>gps_fixed</md-icon>
                  </div>
                  <span class="md-error" v-if="!$v.form.address.required">Il luogo è obbligatorio</span>
                </md-field>
              </div>
            </div>
            <div class="md-layout md-gutter">
              <div class="label">Privacy</div>
              <div class="md-layout-item md-large-size-100" style="font-size: 0.85em">
                <md-radio v-model="form.radio" value="public" class="md-primary">Pubblico (Visibile sulla mappa a chiunque) <small>(Default)</small></md-radio>
                <md-radio v-model="form.radio" value="friends" class="md-primary">Solo amici (visibile sulla mappa solo agli amici)</md-radio>
                <md-radio v-model="form.radio" value="invite" class="md-primary">Su invito (non visibile sulla mappa)</md-radio>
              </div>
            </div>
          </div>

          <md-progress-bar md-mode="indeterminate" v-if="sending" />
        </div>

        <md-snackbar :md-active.sync="activityCreated">L'attività {{ lastActivity }} è stata creata con successo!</md-snackbar>

        <div id="footer-createView">
          <md-button type="submit" class="md-button md-raised md-theme-default" id="createActivityBtn" :disabled="sending">Crea</md-button>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, minLength, maxLength } from 'vuelidate/lib/validators'
  import { Datetime } from 'vue-datetime';
  import 'vue-datetime/dist/vue-datetime.css'
  import MapModal from "../components/MapModal";
  import store from '../store/index.js';

  export default {
    name: 'Create',
    components: {MapModal, Datetime},
    mixins: [validationMixin],
    data: () => ({
      form: {
        title: null,
        selectedDate: null,
        category: "generic",
        singleImg: null,
        participants: 2,
        address: null,
        radio: "public"
      },
      minDatetime: new Date().toISOString(),
      activityCreated: false,
      sending: false,
      lastActivity: null,
      coordinates: [],
      showMap: false
    }),
    computed: {
      categories() {
        return store.getters.categories;
      }
    },
    validations: {
      form: {
        title: {
          required,
          minLength: minLength(3)
        },
        selectedDate: {
          required
        },
        participants: {
          required,
          maxLength: maxLength(3)
        },
        description: {
          required
        },
        address: {
          required
        }
      }
    },
    methods: {
      updateColor() {
        if (this.form.selectedDate !== "") {
          $("#datetimeIcon").css("color", "#757575");
        }
      },
      getCategories() {
        return store.getters.categories;
      },
      updateMinDatetime() {
        this.minDatetime = new Date().toISOString();
      },
      getValidationClass (fieldName) {
        const field = this.$v.form[fieldName];

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
      clearForm () {
        this.$v.$reset();
        this.form.title = null;
      },
      createActivity () {
        let date = new Date(this.form.selectedDate);
        let event = {
          id: store.getters.globalEventId,
          title: this.form.title,
          category: this.form.category,
          date: date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear(),
          time: date.getHours() + ':' + date.getMinutes(),
          description: this.form.description,
          maxParticipants: parseInt(this.form.participants) + 1,
          visibility: this.form.radio,
          address: this.form.address,
          coords: this.coordinates,
          image: '',
          creator: store.getters.userId,
          participants: [store.getters.userId],
          active: 1
        };

        store.commit('addEvent', event);
        store.commit('incrementEventId');

        this.$router.push({name: 'activityDetails', params: {id: event.id, afterCreation: true}});
      },
      validateActivity() {
        this.$v.$touch();

        if (!this.$v.$invalid) {
          this.createActivity()
        }
        else if (this.form.selectedDate === ""){
          $("#datetimeIcon").css("color","#ff1844");
          $("#datetimeInputLabel").css("color","#ff1844");
        }
      }
    }
  }
</script>

<style scoped>
  #div-date{
    margin-right: 8%;
  }

  .md-radio {
    display: flex;
  }

  #createView{
    height: 93%;
    overflow-y: overlay;
  }

  .md-field .vdatetime{
    width: 100%;
  }

  .md-dialog {
    z-index: 13;
  }

  #map-modal {
    width: 85%;
    height: 85%;
  }
  #footer-createView{
    width: 100%;
  }
  .md-button{
    border: 1px solid gainsboro;
    border-radius: 8px;
  }
  #participants {
    width: 100%;
  }
</style>
