const bunyan = require('bunyan');

function serializer(data) {
  const query = JSON.stringify(data.query);
  const options = JSON.stringify(data.options || data.doc);
  return `db.${data.coll}.${data.method}(${query}, ${options});`;
}

const log = bunyan.createLogger({
  name: 'kammy',
  src: false,
  streams: [
    {
      level: 'debug',
      stream: process.stdout
    },
    {
      level: 'info',
      path: './mongo.log'
    }
  ],
  serializers: {
    dbQuery: serializer
  },
});

export default function (coll, method, query, doc, options) {
  if (process.env.NODE_ENV !== 'production') {
    log.info({
      dbQuery: {
        coll,
        method,
        query,
        doc,
        options
      }
    });
  }
}
