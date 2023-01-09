import { Test, TestingModule } from '@nestjs/testing';
import { ComprobantesSalidasService } from './comprobantes-salidas.service';

describe('ComprobantesSalidasService', () => {
  let service: ComprobantesSalidasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComprobantesSalidasService],
    }).compile();

    service = module.get<ComprobantesSalidasService>(ComprobantesSalidasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
