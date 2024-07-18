import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('taskManager.db');

export const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS taskGroups (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL);'
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY NOT NULL, groupId INTEGER, title TEXT NOT NULL, details TEXT, FOREIGN KEY (groupId) REFERENCES taskGroups (id));'
    );
  });
};

export const addTaskGroupToDB = (title: string, callback: (insertId: number) => void) => {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO taskGroups (title) VALUES (?);', [title], (_, result) => {
      callback(result.insertId);
    });
  });
};

export const addTaskToDB = (groupId: number, title: string, callback: (insertId: number) => void) => {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO tasks (groupId, title) VALUES (?, ?);', [groupId, title], (_, result) => {
      callback(result.insertId);
    });
  });
};
