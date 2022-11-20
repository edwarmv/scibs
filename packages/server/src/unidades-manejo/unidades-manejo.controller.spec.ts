import { Test, TestingModule } from '@nestjs/testing';
import { UnidadesManejoController } from './unidades-manejo.controller';

describe('UnidadesManejoController', () => {
  let controller: UnidadesManejoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnidadesManejoController],
    }).compile();

    controller = module.get<UnidadesManejoController>(UnidadesManejoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
