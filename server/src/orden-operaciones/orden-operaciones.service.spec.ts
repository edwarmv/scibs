import { Test, TestingModule } from '@nestjs/testing';
import { OrdenOperacionesService } from './orden-operaciones.service';

describe('OrdenOperacionesService', () => {
  let service: OrdenOperacionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdenOperacionesService],
    }).compile();

    service = module.get<OrdenOperacionesService>(OrdenOperacionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
