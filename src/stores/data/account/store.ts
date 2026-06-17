import { AccountObservable } from "./observable";
import { LoginCredentials } from "@/models/user";
import { login } from "@/services/auth_services";
import STORAGE_NAMES from "@/utils/storage_name";

export class AccountStore {
  observable: AccountObservable;

  constructor(observable: AccountObservable) {
    this.observable = observable;
  }

  async login(credentials: LoginCredentials) {
    this.observable.isLoading = true;
    this.observable.error = null;
    try {
      const response = await login(credentials);
      this.observable.token = response.token;
      this.observable.user = response.user;
      localStorage.setItem(STORAGE_NAMES.TOKEN, response.token);
      localStorage.setItem(STORAGE_NAMES.USER, JSON.stringify(response.user));
    } catch (error: any) {
      this.observable.error = error?.response?.data?.message || "Login failed";
      throw error;
    } finally {
      this.observable.isLoading = false;
    }
  }

  logout() {
    this.observable.token = null;
    this.observable.user = null;
    localStorage.removeItem(STORAGE_NAMES.TOKEN);
    localStorage.removeItem(STORAGE_NAMES.USER);
  }

  loadFromStorage() {
    const token = localStorage.getItem(STORAGE_NAMES.TOKEN);
    const user = localStorage.getItem(STORAGE_NAMES.USER);
    if (token && user) {
      this.observable.token = token;
      this.observable.user = JSON.parse(user);
    }
  }

  get isAuthenticated() {
    return !!this.observable.token;
  }
}