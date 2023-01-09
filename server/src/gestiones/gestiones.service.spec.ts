import { Test, TestingModule } from '@nestjs/testing';
import { GestionesService } from './gestiones.service';

describe('GestionesService', () => {
  let service: GestionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GestionesService],
    }).compile();

    service = module.get<GestionesService>(GestionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
