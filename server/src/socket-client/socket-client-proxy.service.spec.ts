import { Test, TestingModule } from '@nestjs/testing';
import { SocketClientProxyService } from './socket-client-proxy.service';

describe('SocketClientProxyService', () => {
  let service: SocketClientProxyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketClientProxyService],
    }).compile();

    service = module.get<SocketClientProxyService>(SocketClientProxyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
