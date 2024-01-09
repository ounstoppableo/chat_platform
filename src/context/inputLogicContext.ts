import { createContext } from 'react';
type inputLogic = {
  inputValue: string;
  setInputValue: any;
};
const inputLogicContext = createContext<inputLogic>({} as inputLogic);
export default inputLogicContext;
