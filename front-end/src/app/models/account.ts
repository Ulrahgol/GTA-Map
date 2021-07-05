export class Account {

    constructor(username: string, password: string){
        this.username = username;
        this.password = password;
    }

    public id: number = 0;
    public username: string = "";
    public password: string = "";
}