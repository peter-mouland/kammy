import Chance from 'chance';
import { expect } from '../../../tests/config/test.helper';
import { validateSignUpResponse, validateLoginResponse, text } from './response-validation';

const chance = new Chance();

describe('auth-validation', ()=>{
  describe('validateSignupResponse',  () => {
    it('returns a successful 200 status if no error is passed', () => {
      const successResponse = validateSignUpResponse();
      expect(successResponse.status).to.equal(200);
      expect(successResponse.body.success).to.equal(true);
      expect(successResponse.body.message).to.equal(text.signUpResponse.success);
    });

    it('returns a 409 status for MongoError 11000', () => {
      const successResponse = validateSignUpResponse({ name: 'MongoError', code: 11000 });
      expect(successResponse.status).to.equal(409);
      expect(successResponse.body.success).to.equal(false);
      expect(successResponse.body.message).to.equal(text.signUpResponse.errors.message);
      expect(successResponse.body.errors.email).to.equal(text.signUpResponse.errors.email);
    });

    it('returns a 400 status for other errors', () => {
      const successResponse = validateSignUpResponse({ name: chance.word() });
      expect(successResponse.status).to.equal(400);
      expect(successResponse.body.success).to.equal(false);
      expect(successResponse.body.message).to.equal(text.signUpResponse.error400);
    });
  });

  describe('validateLoginResponse',  () => {
    it('returns a successful 200 status with token and userData if no error is passed', () => {
      const fakeToken = chance.apple_token();
      const fakeUserData = chance.word();
      const response = validateLoginResponse(false, fakeToken, fakeUserData);
      expect(response.status).to.equal(200);
      expect(response.body.success).to.equal(true);
      expect(response.body.message).to.equal(text.loginResponse.success);
      expect(response.body.token).to.equal(fakeToken);
      expect(response.body.user).to.equal(fakeUserData);
    });

    it('returns a 409 status for IncorrectCredentialsError', () => {
      const message = chance.word();
      const response = validateLoginResponse({ name: 'IncorrectCredentialsError', message });
      expect(response.status).to.equal(400);
      expect(response.body.success).to.equal(false);
      expect(response.body.message).to.equal(message);
    });

    it('returns a 400 status for other errors', () => {
      const response = validateLoginResponse({ name: chance.word() });
      expect(response.status).to.equal(400);
      expect(response.body.success).to.equal(false);
      expect(response.body.message).to.equal(text.loginResponse.error400);
    });
  });
});
