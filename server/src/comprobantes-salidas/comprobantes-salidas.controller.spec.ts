import { Test, TestingModule } from '@nestjs/testing';
import { ComprobantesSalidasController } from './comprobantes-salidas.controller';

describe('ComprobantesSalidasController', () => {
  let controller: ComprobantesSalidasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComprobantesSalidasController],
    }).compile();

    controller = module.get<ComprobantesSalidasController>(ComprobantesSalidasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
