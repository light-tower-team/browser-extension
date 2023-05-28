import { AutofillScriptExecuteEngine } from "./AutofillScriptExecuteEngine";
import { PageDetailsCollector } from "./PageDetailsCollector";
import { SignInAutofillScriptGenerator } from "./scripts/SignInAutofillScript";

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

setTimeout(() => {
  const pageDetailsCollector = new PageDetailsCollector();
  const pageDetails = pageDetailsCollector.collect(document);

  const signInAutofillScriptGenerator = new SignInAutofillScriptGenerator();
  const autofillScript = signInAutofillScriptGenerator.generateScript(pageDetails, {
    username: "u_test",
    password: "p_test",
  });

  const autofillScriptExecuteEngine = new AutofillScriptExecuteEngine(pageDetailsCollector.fieldsBuffer);
  autofillScriptExecuteEngine.execute(autofillScript);
}, 1000);
