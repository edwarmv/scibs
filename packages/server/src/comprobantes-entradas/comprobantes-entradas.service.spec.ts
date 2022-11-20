import { Test, TestingModule } from '@nestjs/testing';
import { ComprobantesEntradasService } from './comprobantes-entradas.service';

describe('ComprobantesEntradasService', () => {
  let service: ComprobantesEntradasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComprobantesEntradasService],
    }).compile();

    service = module.get<ComprobantesEntradasService>(ComprobantesEntradasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
