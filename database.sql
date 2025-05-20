CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  photo VARCHAR(255) DEFAULT NULL
);

CREATE TABLE grades (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11) NOT NULL,
  course VARCHAR(255) NOT NULL,
  prelim INT(11),
  midterm INT(11),
  final INT(11),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
