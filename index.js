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

  mounted() {
    this.getMessages();
  },

  methods: {
    async sendMessage(session) {
      for (const obj of document.querySelectorAll(".load_sending")) {
        obj.classList.remove("load_sending_hidden");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      for (const obj of document.querySelectorAll(".load_sending")) {
        obj.classList.add("load_sending_hidden");
      }

      await this.$graffiti.put(
        {
          value: {
            content: this.myMessage,
            published: Date.now(),
          },
          channels,
        },
        session,
      );
      this.myMessage = "";
      this.getMessages();
    },

    async getMessages() {
      const messageObjectsIterator = await this.$graffiti.discover(channels, {
        value: {
          properties: {
            content: { type: "string" },
            published: { type: "number" },
            author: { type: "string" },
          },
        },
      });


      const newMessageObjects = [];
      for await (const { object } of messageObjectsIterator) {
        newMessageObjects.push(object);
        console.log(object);
      }

      // Sort here

      this.messageObjects = newMessageObjects.toSorted((msg1, msg2) => { msg1.published - msg2.published });
    },

  },
})
  .use(GraffitiPlugin, {
    graffiti: new GraffitiRemote(),
    // graffiti: new GraffitiRemote(),
  })
  .mount("#app");
