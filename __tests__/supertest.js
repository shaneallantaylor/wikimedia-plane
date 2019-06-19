const request = require('supertest');

const server = 'http://localhost:3000';

describe('Route integration', () => {
  describe('/', () => {
    describe('GET', () => {
      // Note that we return the evaluation of `request` here! It evaluates to
      // a promise, so Jest knows not to say this test passes until that
      // promise resolves. See https://jestjs.io/docs/en/asynchronous
      it('responds with 200 status and text/html content type', () => {
        return request(server)
          .get('/')
          .expect('Content-Type', /text\/html/)
          .expect(200);
      });
    });
  });

  describe('/build/bundle.js', () => {
    describe('GET', () => {
      it('responds with 200 status and application/javascript content type', () => {
        return request(server)
          .get('/build/bundle.js')
          .expect('Content-Type', /application\/javascript/)
          .expect(200);
      })
    })
  });

  describe('/api/user', () => {
    describe('GET', () => {
      it('responds with status 200 and an application/json of content-type AND the object contains keys userInfo and snippets ', () => {
        return request(server)
          .get('/api/user')
          .set('Cookie', ['user_id=32', 'hey=yo'])
          .expect(200)
          .expect('Content-Type', /application\/json/)
          .expect(function (res) {
            if (!res.body.userInfo) {
              throw new Error('got no userInfo!')
            }
            if (!res.body.snippets) {
              throw new Error('got no snippets!')
            }
          })
      });
    })
  })

  describe('/gettags', () => {
    describe('GET', () => {
      it('should return an array of objects, with 200 status and app/json', () => {
        return request(server)
          .get('/gettags')
          .set('Cookie', ['user_id=32', 'hey=yo'])
          .expect(200)
          .expect('Content-Type', /application\/json/)
          .expect(function (res) {
            if (!Array.isArray(res.body)) {
              throw new Error('got no tags!')
            }
          })
      });
    })
  });

  describe('/getsnippetsbyuser', () => {
    describe('GET', () => {
      it('should return an array of objects with app/json and 200 status', () => {
        return request(server)
          .get('/getsnippetsbyuser/?username=shane')
          .set('Cookie', ['user_id=32', 'hey=yo'])
          .expect(200)
          .expect('Content-Type', /application\/json/)
          .expect(function (res) {
            if (!Array.isArray(res.body)) {
              throw new Error('got no tags!')
            }
          })
      });
    })
  });

  describe('/getsnippetsbytag', () => {
    describe('GET', () => {
      it('should return an array of objects with app/json and 200 status', () => {
        return request(server)
          .get('/getsnippetsbytag/?tag=Redux')
          .set('Cookie', ['user_id=32', 'hey=yo'])
          .expect(200)
          .expect('Content-Type', /application\/json/)
          .expect(function (res) {
            if (!Array.isArray(res.body)) {
              throw new Error('got no tags!')
            }
          })
      });
    })
  });
});