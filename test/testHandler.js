const request = require('supertest');
const { app } = require('./../lib/routes');

describe('request for static pages', () => {
  it('should response back with index.html for /', done => {
    request(app)
      .get('/')
      .expect(200)
      .expect(/Stratego/)
      .end(err => {
        if (err) {
          done(err);
          return;
        }
        done();
      });
  });
});
