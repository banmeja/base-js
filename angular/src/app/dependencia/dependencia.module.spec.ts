import { DependenciaModule } from './dependencia.module';

describe('DependenciaModule', () => {
  let dependenciaModule: DependenciaModule;

  beforeEach(() => {
    dependenciaModule = new DependenciaModule();
  });

  it('should create an instance', () => {
    expect(dependenciaModule).toBeTruthy();
  });
});
