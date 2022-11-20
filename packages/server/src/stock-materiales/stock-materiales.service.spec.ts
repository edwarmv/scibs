import { Test, TestingModule } from '@nestjs/testing';
import { StockMaterialesService } from './stock-materiales.service';

describe('StockMaterialesService', () => {
  let service: StockMaterialesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockMaterialesService],
    }).compile();

    service = module.get<StockMaterialesService>(StockMaterialesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
