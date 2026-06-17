import { createContext, useContext } from "react";
import { RootStore } from "./action";

const store = new RootStore();
const StoreContext = createContext(store);

export const useStore = () => useContext(StoreContext);
export const StoreProvider = StoreContext.Provider;
export default store;