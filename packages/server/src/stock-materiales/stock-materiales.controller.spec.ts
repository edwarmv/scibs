import { Test, TestingModule } from '@nestjs/testing';
import { StockMaterialesController } from './stock-materiales.controller';

describe('StockMaterialesController', () => {
  let controller: StockMaterialesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockMaterialesController],
    }).compile();

    controller = module.get<StockMaterialesController>(StockMaterialesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
