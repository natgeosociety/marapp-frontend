export interface User {
  id: string;
  name: string;
  email: string;
  groups: any[];
}

export interface UserProps {
  data: User;
}

export interface UserEditProps {
  data: User;
  newUser: boolean;
}
