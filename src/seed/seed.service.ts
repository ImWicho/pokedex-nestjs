import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePokemonDto } from 'src/pokemons/dto/create-pokemon.dto';
import { Pokemon } from 'src/pokemons/entities/pokemon.entity';

@Injectable()
export class SeedService {
  constructor(@InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=650');
    const { results } = await response.json();
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
