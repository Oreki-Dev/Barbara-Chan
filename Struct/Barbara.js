const { Client, version, Collection } = require("discord.js");
const { performance } = require("perf_hooks");
const Utils = require("./Utils.js");
const Logger = require("./Logger.js");
const Pagination = require("./Pagination.js");

module.exports = class BarbaraClient extends Client {
  constructor() {
    super({
      intents: 32767,
      cacheGuilds: true,
      cacheRoles: true,
      fetchAllMembers: true,
      partials: ["MESSAGE", "CHANNEL", "REACTION"],
    });

    this.commands = new Collection();
    this.utils = new Utils(this);
    this.logger = new Logger(this);
    this.pagination = new Pagination(this);
    this.config = require("../Assets/Json/Config");

    this.bootTime = null;

    this.once("ready", () => {
      return (this.bootTime = Math.round(performance.now()));
    });
  }

  async init() {
    this.utils.loadCommands();
    this.utils.loadEvents();
    super.login(this.config.token);
  }

  version() {
    let Dversion = version;
    let Cversion = require("../package.json").version;

    return { Dversion: Dversion, Cversion: Cversion };
  }

  color() {
    return "#2C2F33";
  }
};
