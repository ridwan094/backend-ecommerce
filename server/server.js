import config from './../config/config'
import { sequelize } from '../config/config-db';
import app from './express'

/* app.listen(config.port, () =>
  console.info('Server started on port %s.', config.port),
); */

// Connection URL
const dropDatabaseSync = false;
sequelize.sync({ force: dropDatabaseSync }).then(async () => {
    if (dropDatabaseSync) {
        console.log("Connection established, do nothing")
    }

    app.listen(config.port, () =>
        console.info('Server started on port %s.', config.port),
    );
});

export default app;