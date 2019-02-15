<template>
    <div>
        <v-layout>
            <v-card style="width: 100%;border-radius: 0px">
                <v-text-field hide-details append-icon="mic" class="search mx-3" flat label="Search" prepend-inner-icon="search" solo-inverted></v-text-field>
            </v-card>
        </v-layout>
    
        <v-flex class="tabslayout">
            <v-tabs style="width:100%" slot="extension" v-model="tablele" grow>
                <v-tab>Contacts</v-tab>
                <v-tab>Chats</v-tab>
                <v-tab>Status</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tablele">
                <v-tab-item>
                    <contact-list :contacts="contacts"></contact-list>
                </v-tab-item>
                <v-tab-item>
                    <chat-list :chats="chats"></chat-list>
                </v-tab-item>
                <v-tab-item>
                    <status-list></status-list>
                </v-tab-item>
            </v-tabs-items>
        </v-flex>
    </div>
</template>

<<script>
    import { mapGetters, mapActions } from "vuex";
    import chatList from './chatList.vue';
    import contactList from './contactList.vue';
    import statusList from './statusList.vue';
    export default {
        components: {
            chatList, contactList, statusList
        },
        data() {
            return {
                tablele: null,
                user: {
                    avatar: "https://www.bzl.co/avatar/T-pikachu-1481600098.03.jpg",
                    username: "Vosta"
                },
            }
        },
        computed: {
            ...mapGetters(["contacts", "chats"])
        },
        methods: {
            ...mapActions(["requestContacts"])
        },
        created() {
            this.requestContacts();
        },
    }
</script>
