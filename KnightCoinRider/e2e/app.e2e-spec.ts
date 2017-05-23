import { KnightCoinRiderPage } from './app.po';

describe('knight-coin-rider App', () => {
  let page: KnightCoinRiderPage;

  beforeEach(() => {
    page = new KnightCoinRiderPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
