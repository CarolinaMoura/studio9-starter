import { createApp } from "vue";
import { GraffitiLocal } from "@graffiti-garden/implementation-local";
import { GraffitiRemote } from "@graffiti-garden/implementation-remote";
import { GraffitiPlugin } from "@graffiti-garden/wrapper-vue";

const channels = ["designftw"];

createApp({
  data() {
    return {
      myMessage: "",
      sentMessageObjects: [],
      messageObjects: [],
    };
  },

  methods: {
    sendMessage(session) {
      this.sentMessageObjects.push({
        value: {
          content: this.myMessage,
          published: Date.now(),
        },
        channels,
      });
      this.myMessage = "";
      this.getMessages();
    },

    getMessages() {
      const messageObjectsIterator = this.getMessageObjectsIterator();

      const newMessageObjects = [];
      for (const { object } of messageObjectsIterator) {
        newMessageObjects.push(object);
      }

      // Sort here

      this.messageObjects = toSorted(newMessageObjects, (msg1, msg2) => {msg1.published-msg2.published});
    },

    *getMessageObjectsIterator() {
      for (const object of this.sentMessageObjects) {
        yield { object };
      }
    },
  },
})
  .use(GraffitiPlugin, {
    graffiti: new GraffitiLocal(),
    // graffiti: new GraffitiRemote(),
  })
  .mount("#app");
