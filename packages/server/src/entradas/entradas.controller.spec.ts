import { Test, TestingModule } from '@nestjs/testing';
import { EntradasController } from './entradas.controller';

describe('EntradasController', () => {
  let controller: EntradasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntradasController],
    }).compile();

    controller = module.get<EntradasController>(EntradasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
