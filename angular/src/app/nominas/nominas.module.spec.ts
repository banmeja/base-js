import { NominasModule } from './nominas.module';

describe('NominasModule', () => {
  let nominasModule: NominasModule;

  beforeEach(() => {
    nominasModule = new NominasModule();
  });

  it('should create an instance', () => {
    expect(nominasModule).toBeTruthy();
  });
});
