import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { UsersRepository } from '../../../users/repositories/implementations/UsersRepository';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .where("games.title ilike :title", {title: `%${param}%`})
      .getMany()
      // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("select count(*) from games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    
    const users = await this.repository
    .createQueryBuilder()
    .relation(Game, "users")
    .of(id)
    .loadMany();

    if(!users) throw new Error("User don't exists");
     
    
    return  users   ;

  }
}
