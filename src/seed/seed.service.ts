import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FetchAdapter } from 'src/common/adapters/fetch.adapter';
import { CreatePokemonDto } from 'src/pokemons/dto/create-pokemon.dto';
import { Pokemon } from 'src/pokemons/entities/pokemon.entity';
import { PokemonResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
    private readonly http: FetchAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const { results } = await this.http.get<PokemonResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=100',
    );
    const pokemonToInsert: CreatePokemonDto[] = [];

    results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      pokemonToInsert.push({ name, no });
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return results;
  }
}
