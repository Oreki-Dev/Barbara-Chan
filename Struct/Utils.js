const { sync } = require("glob");
const { resolve } = require("path");

module.exports = class Utils {
  constructor(client) {
    this.client = client;
  }
  async loadCommands() {
    const commandFiles = sync(resolve("./Commands/**/*.js"));

    let array = [];

    for (const filepath of commandFiles) {
      const command = require(filepath);
      if (command) {
        this.client.commands.set(command.name, command);
        array.push(command);
      } else {
        continue;
      }
    }
    this.client.on("ready", async (client) => {
      await client.guilds.cache.get("904969361557684234").commands.set(array);
    });
    this.client.logger.success("Command", "All Commands Loaded");
  }

  async loadEvents() {
    const eventFiles = sync(resolve("./Events/*.js"));

    for (const filepath of eventFiles) {
      const event = require(filepath);
      if (event) {
        this.client.on(event.name, event.run.bind(null, this.client));
      } else {
        continue;
      }
    }

    this.client.logger.success("Events", "All Events Loaded");
  }
};
