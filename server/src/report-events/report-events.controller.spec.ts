import { Test, TestingModule } from '@nestjs/testing';
import { ReportEventsController } from './report-events.controller';

describe('ReportEventsController', () => {
  let controller: ReportEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportEventsController],
    }).compile();

    controller = module.get<ReportEventsController>(ReportEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
