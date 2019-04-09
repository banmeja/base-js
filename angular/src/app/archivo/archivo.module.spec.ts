import { ArchivoModule } from './archivo.module';

describe('ArchivoModule', () => {
  let archivoModule: ArchivoModule;

  beforeEach(() => {
    archivoModule = new ArchivoModule();
  });

  it('should create an instance', () => {
    expect(archivoModule).toBeTruthy();
  });
});
