import { getAll } from "./querys.js";
import dbconfig from "./connection.js";

//Indicar la base de datos y su tabla
console.log(await getAll('drinkers.inventario'))