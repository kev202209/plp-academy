-- Database: Library Management System

-- 1. Create the 'Books' table
CREATE TABLE Books (
    BookID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    ISBN VARCHAR(13) NOT NULL UNIQUE,
    PublicationYear INT,
    Author VARCHAR(255) NOT NULL,
    Genre VARCHAR(100),
    TotalCopies INT NOT NULL,
    AvailableCopies INT NOT NULL,
    CHECK (TotalCopies >= 0),
    CHECK (AvailableCopies >= 0 AND AvailableCopies <= TotalCopies)
);

-- 2. Create the 'Members' table
CREATE TABLE Members (
    MemberID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PhoneNumber VARCHAR(20),
    Address VARCHAR(255),
    MembershipDate DATE NOT NULL
);

-- 3. Create the 'Loans' table to track book loans
CREATE TABLE Loans (
    LoanID INT PRIMARY KEY AUTO_INCREMENT,
    BookID INT NOT NULL,
    MemberID INT NOT NULL,
    LoanDate DATE NOT NULL,
    ReturnDate DATE,
    Status ENUM('On Loan', 'Returned', 'Overdue') NOT NULL DEFAULT 'On Loan',
    FOREIGN KEY (BookID) REFERENCES Books(BookID),
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID),
    CHECK (LoanDate <= ReturnDate OR ReturnDate IS NULL)
);

-- 4. Create the 'Reservations' table to manage book reservations
CREATE TABLE Reservations (
    ReservationID INT PRIMARY KEY AUTO_INCREMENT,
    BookID INT NOT NULL,
    MemberID INT NOT NULL,
    ReservationDate DATE NOT NULL,
    Status ENUM('Pending', 'Active', 'Cancelled', 'Completed') NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (BookID) REFERENCES Books(BookID),
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID)
);

-- 5. Create the 'Fines' table to record fines for overdue books
CREATE TABLE Fines (
    FineID INT PRIMARY KEY AUTO_INCREMENT,
    LoanID INT NOT NULL,
    FineAmount DECIMAL(10, 2) NOT NULL,
    PaymentDate DATE,
    Status ENUM('Unpaid', 'Paid', 'Waived') NOT NULL DEFAULT 'Unpaid',
    FOREIGN KEY (LoanID) REFERENCES Loans(LoanID),
    CHECK (FineAmount >= 0)
);

-- 6. Create the 'BookAuthors' table to handle the many-to-many relationship between books and authors
CREATE TABLE BookAuthors (
    BookID INT NOT NULL,
    AuthorName VARCHAR(255) NOT NULL,
    PRIMARY KEY (BookID, AuthorName),
    FOREIGN KEY (BookID) REFERENCES Books(BookID)
);

-- 7. Create the 'BookGenres' table to handle the many-to-many relationship between books and genres
CREATE TABLE BookGenres (
    BookID INT NOT NULL,
    Genre VARCHAR(100) NOT NULL,
    PRIMARY KEY (BookID, Genre),
    FOREIGN KEY (BookID) REFERENCES Books(BookID)
);
-- 8. Create the 'Staff' table to manage library staff
CREATE TABLE Staff (
    StaffID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PhoneNumber VARCHAR(20),
    Position VARCHAR(100) NOT NULL,
    HireDate DATE NOT NULL
);