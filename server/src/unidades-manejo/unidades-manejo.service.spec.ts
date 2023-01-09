import { Test, TestingModule } from '@nestjs/testing';
import { UnidadesManejoService } from './unidades-manejo.service';

describe('UnidadesManejoService', () => {
  let service: UnidadesManejoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnidadesManejoService],
    }).compile();

    service = module.get<UnidadesManejoService>(UnidadesManejoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
