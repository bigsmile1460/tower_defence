import { loadData, response } from "./loadData.js";

const handlerMapping = {
  1: loadData,
  2: response,
};

export default handlerMapping;
