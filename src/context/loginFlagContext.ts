import { createContext } from 'react';
type LoginFlagContext = {
  showLoginForm: () => void;
  closeLoginForm: () => void;
};
const loginFlagContext = createContext<LoginFlagContext>(
  {} as LoginFlagContext
);
export default loginFlagContext;
