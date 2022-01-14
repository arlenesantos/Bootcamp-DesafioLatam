
const { Pool } = require("pg");

const config = {
  user: "postgres",
  host: "localhost",
  password: "senhapostgre",
  database: "cursos",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000,
};

//Se implementa módulo Singleton para usar solo una instancia de pool
const Singleton = (function () {
  var instance;

  function createInstance() {
    var classObj = new Pool(config);
    return classObj;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
        console.log("Crea Pool");
      } else {
        console.log("Ya existe Pool");
      }
      return instance;
    },
  };
})();

module.exports = Singleton;
