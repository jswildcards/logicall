export default class Author {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string;
  added: string;

  constructor(id: number, first_name: string, last_name: string, email: string, birthdate: string, added: string) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.birthdate = birthdate;
    this.added = added;
  }
};