// Create application user
db = db.getSiblingDB('smart-study-scheduler');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'name'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        name: {
          bsonType: 'string',
          minLength: 2
        }
      }
    }
  }
});

db.createCollection('tasks');
db.createCollection('studyplans');
db.createCollection('progress');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.tasks.createIndex({ user: 1, dueDate: 1 });
db.tasks.createIndex({ user: 1, status: 1 });
db.studyplans.createIndex({ user: 1, status: 1 });
db.progress.createIndex({ user: 1, date: 1 });

print('Database initialized successfully');