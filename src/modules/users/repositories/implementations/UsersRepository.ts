import { getRepository, Repository } from 'typeorm';
import { Game } from '../../../games/entities/Game';
import { GamesRepository } from '../../../games/repositories/implementations/GamesRepository';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;
  
  constructor() {
    this.repository = getRepository(User);

  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const id = user_id
    const user = await this.repository.createQueryBuilder("users")
    .leftJoinAndSelect("users.games", "games")
    .where("users.id = :id", { id: `${user_id}`})
    .getOne()

    if(!user) throw new Error("User don't exists");

    return user;

  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const users = await this.repository.find()

    return this.repository.query("Select * from users order by first_name"); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {

    // const query = await this.repository.createQueryBuilder()
    //     .where("first_name="+first_name+" && "+"last_name="+last_name)
    return this.repository.query(`Select * from users where LOWER(first_name) = LOWER('${first_name}') OR LOWER(last_name) = LOWER('${last_name}')`); // Complete usando raw query
  }
}
