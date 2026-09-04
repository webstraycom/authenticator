import { db } from '@utils/db';

export const useDatabase = () => {
  const compactDatabase = () => {
    return new Promise((resolve) => {
      db.once('compaction.done', () => resolve());
      db.persistence.compactDatafile();
    });
  };

  const clearDatabase = () => {
    return new Promise((resolve, reject) => {
      db.remove({}, { multi: true }, (err, numRemoved) => {
        if (err) return reject(err);
        db.once('compaction.done', () => resolve(numRemoved));
        db.persistence.compactDatafile();
      });
    });
  };

  return { compactDatabase, clearDatabase };
};
