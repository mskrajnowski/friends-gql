import { FriendsGqlAppPage } from './app.po';

describe('friends-gql-app App', function() {
  let page: FriendsGqlAppPage;

  beforeEach(() => {
    page = new FriendsGqlAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
