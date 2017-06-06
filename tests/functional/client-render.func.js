import cookie from 'react-cookie';
import Chance from 'chance';
import jwt from 'jsonwebtoken';
import Redirect from 'react-router-dom/Redirect';

import { React, mount, expect, shallow } from '../config/test.helper';
import Root, { Router } from '../../src/app/Root';
import Homepage from '../../src/app/containers/Homepage/Homepage';
import NotFound from '../../src/app/containers/NotFound/NotFound';
import LoginPage from '../../src/app/authentication/containers/LoginPage/LoginPage';
import MyTeam from '../../src/app/containers/MyTeam/MyTeam';
import users from '../test-servers/scripts/users';
import config from '../../src/config/db.js'; // must be app secret not test secret!

const chance = new Chance();

// Add fixture data -> Needed to get a valid token that points to a valid user in the test db
const insertUsers = (fakeUser) => {
  return users.puke(fakeUser).then((insertedUser) => {
    const payload = { sub: insertedUser };
    const token = jwt.sign(payload, config.jwtSecret);
    return token;
  });
};
// end Add fixture data

describe('Client Render', function () {
  afterEach(() => {
    this.wrapper.unmount();
    cookie.remove('token');
  });

  it('Should render the Homepage', () => {
    this.wrapper = mount(<Root location="/"/>);
    expect(this.wrapper.find(Homepage).length).to.equal(1);
  });

  describe('404', () => {
    it('should render the 404 route', () => {
      this.wrapper = mount(<Root location="/not-found/"/>);
      expect(this.wrapper.find(NotFound).length).to.equal(1);
      expect(this.wrapper.find('#not-found').length).to.equal(1);
    });
  });

  describe('my-team ', () => {
    it('requires auth and should render the Login page', () => {
      this.wrapper = mount(<Root location="/my-team/" context={{}}/>);
      expect(this.wrapper.find(NotFound).length).to.equal(0);
      expect(this.wrapper.find(MyTeam).length).to.equal(0);
      expect(this.wrapper.find(Redirect).length).to.equal(1);
      expect(this.wrapper.find(Redirect).props().to.pathname).to.equal('/login');
    });

    // fix by using mock data/fetch in test
    it.skip('requires auth and should render the myTeam with correct cookie + user id', () => {
      const fakeUser = { email: chance.email() };
      return insertUsers(fakeUser)
        .then(token => {
          cookie.save('token', token, {path: '/'});
          this.wrapper = mount(<Root location="/my-team/" context={{}}/>);
          expect(this.wrapper.find(NotFound).length).to.equal(0);
          expect(this.wrapper.find(Redirect).length).to.equal(0);
          expect(this.wrapper.find(MyTeam).length).to.equal(1);
          expect(this.wrapper.find('#my-team').length).to.equal(1);
        }).then(() =>{
          return users.nuke(fakeUser);
        }).catch((e) => {
          throw new Error(e);
        })
    });
  });

  describe('login ', () => {
    it(' should render the Login page', () => {
      this.wrapper = mount(<Root location="/login/" context={{}}/>);
      expect(this.wrapper.find(NotFound).length).to.equal(0);
      expect(this.wrapper.find(LoginPage).length).to.equal(1);
    });
  });
});
