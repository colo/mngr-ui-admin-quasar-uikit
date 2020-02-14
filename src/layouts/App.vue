<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header> -->

    <!-- <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Essential Links</q-item-label>
        <q-item clickable tag="a" target="_blank" href="https://quasar.dev">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Docs</q-item-label>
            <q-item-label caption>quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://github.quasar.dev">
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Github</q-item-label>
            <q-item-label caption>github.com/quasarframework</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://chat.quasar.dev">
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Discord Chat Channel</q-item-label>
            <q-item-label caption>chat.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://forum.quasar.dev">
          <q-item-section avatar>
            <q-icon name="record_voice_over" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Forum</q-item-label>
            <q-item-label caption>forum.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://twitter.quasar.dev">
          <q-item-section avatar>
            <q-icon name="rss_feed" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Twitter</q-item-label>
            <q-item-label caption>@quasarframework</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://facebook.quasar.dev">
          <q-item-section avatar>
            <q-icon name="public" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Facebook</q-item-label>
            <q-item-label caption>@QuasarFramework</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer> -->

    <vk-card class="uk-background-secondary">

      <router-link
        to="/logs"
        v-slot="{ href, route, navigate, isActive, isExactActive }"
      >

        <vk-button-link :href="href" @click="navigate" class="uk-button uk-button-secondary">Logs</vk-button-link>
      </router-link>

      <router-link
        to="/os"
        v-slot="{ href, route, navigate, isActive, isExactActive }"
      >

        <vk-button-link :href="href" @click="navigate" class="uk-button uk-button-secondary">OS</vk-button-link>
      </router-link>

      <router-link
        to="/munin"
        v-slot="{ href, route, navigate, isActive, isExactActive }"
      >

        <vk-button-link :href="href" @click="navigate" class="uk-button uk-button-secondary">Munin</vk-button-link>
      </router-link>

      <router-link
        to="/vhosts"
        v-slot="{ href, route, navigate, isActive, isExactActive }"
      >

        <vk-button-link :href="href" @click="navigate" class="uk-button uk-button-secondary">Vhosts</vk-button-link>
      </router-link>

      <router-link
        to="/checks"
        v-slot="{ href, route, navigate, isActive, isExactActive }"
      >

        <vk-button-link :href="href" @click="navigate" class="uk-button uk-button-secondary">Checks</vk-button-link>
      </router-link>

      <router-link
        to="/alerts"
        v-slot="{ href, route, navigate, isActive, isExactActive }"
      >

        <vk-button-link :href="href" @click="navigate" class="uk-button uk-button-secondary">Alerts</vk-button-link>
      </router-link>
    </vk-card>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MyLayout',

  data () {
    return {
      // leftDrawerOpen: false
    }
  }
}
</script>
