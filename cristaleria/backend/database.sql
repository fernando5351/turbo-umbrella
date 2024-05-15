-- Tabla de Roles
CREATE TABLE Roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    createdAt DATE  DEFAULT CURRENT_DATE,
    updatedAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Permisos para Rol
CREATE TABLE Role_Permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT,
    access_name VARCHAR(50) NOT NULL,
    can_create BOOLEAN DEFAULT FALSE,
    can_read BOOLEAN DEFAULT FALSE,
    can_update BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    createdAt DATE  DEFAULT CURRENT_DATE,
    updatedAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    FOREIGN KEY (role_id) REFERENCES Roles(id)
);

-- Tabla de Usuarios
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role_id INT,
    createdAt DATE  DEFAULT CURRENT_DATE,
    updatedAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    FOREIGN KEY (role_id) REFERENCES Roles(id)
);

-- tabla especies
CREATE TABLE Species (
    id int not null primary key auto_increment,  
   name varchar(45),  
   classification varchar(45)
);

-- Tabla de Mascotas
CREATE TABLE Pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    specie_id VARCHAR(50) NOT NULL,
    breed VARCHAR(50), -- raza
    age INT,
    owner_id INT,
    FOREIGN KEY (owner_id) REFERENCES Owners(id)
);

-- directions
CREATE TABLE Directions {
    id INT  AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    street VARCHAR(100),
    colonia  VARCHAR(100),
    home INT,
    reference VARCHAR(200)
}

-- Tabla de Propietarios
CREATE TABLE Owners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    direction_id  INT NOT NULL,
    dui  CHAR(10) UNIQUE NOT NULL,
    phone CHAR(9),
    FOREIGN KEY(direction_id) REFERENCES Directions(id)
);


------> revision <-----
-- Tabla de Acciones
CREATE TABLE Actions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL,
    action_description TEXT,
    action_date DATE NOT NULL,
    pet_id INT,
    owner_id INT,
    FOREIGN KEY (pet_id) REFERENCES Pets(id),
    FOREIGN KEY (owner_id) REFERENCES Owners(id)
);

-- Tabla de Sanciones
CREATE TABLE Sanctions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sanction_type VARCHAR(50) NOT NULL,
    sanction_description TEXT,
    createdAt DATE NOT NULL,
    owner_id INT,
    action_id INT,
    FOREIGN KEY (owner_id) REFERENCES Owners(owner_id),
    FOREIGN KEY (action_id) REFERENCES Actions(id),
);

-- Tabla para montos de multas
CREATE TABLE FineAmount {
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(8,2)
    createdAt DATE NOT NULL
}

-- Tabla de Multas
CREATE TABLE Fines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fine_amount_id DECIMAL(10, 2) NOT NULL,
    description TEXT,
    createdAt DATE NOT NULL,
    owner_id INT,
    staus BOOLEAN DEFAULT false;
    FOREIGN KEY (owner_id) REFERENCES Owners(owner_id),
    FOREIGN KEY (fine_amount_id) REFERENCES FineAmount(id)
);
