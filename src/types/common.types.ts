export namespace CommonTypes {
  export type User = {
    id: string;
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    preferences: string[];
    favorites: string[];
    read: string[];
    created_at: Date;
    last_login: Date;
  };

  export type UserLogin = {
    username: string;
    password: string;
  };
}
