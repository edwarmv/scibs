import { Test, TestingModule } from '@nestjs/testing';
import { ComprobantesEntradasController } from './comprobantes-entradas.controller';

describe('ComprobantesEntradasController', () => {
  let controller: ComprobantesEntradasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComprobantesEntradasController],
    }).compile();

    controller = module.get<ComprobantesEntradasController>(ComprobantesEntradasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
