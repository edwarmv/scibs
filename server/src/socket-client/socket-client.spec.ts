import { Test, TestingModule } from '@nestjs/testing';
import { SocketClient } from './socket-client';

describe('SocketClient', () => {
  let provider: SocketClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketClient],
    }).compile();

    provider = module.get<SocketClient>(SocketClient);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
