import { Test, TestingModule } from '@nestjs/testing';
import { GestionesController } from './gestiones.controller';

describe('GestionesController', () => {
  let controller: GestionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GestionesController],
    }).compile();

    controller = module.get<GestionesController>(GestionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
