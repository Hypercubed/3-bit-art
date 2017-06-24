import { ThreebitartPage } from './app.po';

describe('threebitart App', () => {
  let page: ThreebitartPage;

  beforeEach(() => {
    page = new ThreebitartPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
