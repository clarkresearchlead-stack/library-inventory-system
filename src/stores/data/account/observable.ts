import { makeAutoObservable } from "mobx";
import { User } from "@/models/user";

export class AccountObservable {
  token: string | null = null;
  user: User | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }
}