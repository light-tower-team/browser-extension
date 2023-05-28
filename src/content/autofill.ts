import { PageDetailsCollector } from "./PageDetailsCollector";

/*
1. collecting page details
  - collector
2. generating fill script
  - sign-in generator 
  - card generator 
  - indent generator 
3. fill script execute engine
  - engine
*/

const pageDetailsCollector = new PageDetailsCollector();
const pageDetails = pageDetailsCollector.collect(document);

debugger;
