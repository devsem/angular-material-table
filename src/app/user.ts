export class User {
  constructor(
    public Id: number,
    public Name: string,
    public Age: number,
    public Surname: string,
    public Email: string,
    public IsEdit: boolean,
    public Icon: string = 'edit'
  ) { }
}
