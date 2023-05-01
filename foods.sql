-- foods.sql
-- This file contains the sql commands used to create and fill up
-- the foods database.

create database afolabifoods;
use afolabifoods;

-- Create a table with an integer id for each food.
create table food (
  id integer primary key,
  name varchar(128),
  size integer,
  sizeunit char(6),
  cal integer,
  sodium integer
);

-- Notice that the unit is always 6 chars long
insert into food values 
  (1, "Banana", 1, "medium", 105, 1),
  (2, "Snickers", 58, "grams ", 240, 140),
  (3, "Cheerios", 1, "cup   ", 120, 35),
  (4, "Apple", 1, "medium", 95, 0),
  (5, "Peanut Butter", 32, "grams ", 190, 140),
  (6, "Yogurt", 170, "grams ", 150, 85),
  (7, "Chicken Breast", 100, "grams ", 165, 75),
  (8, "Salmon", 100, "grams ", 206, 58),
  (9, "Broccoli", 91, "grams ", 31, 30),
  (10, "Spinach", 30, "grams ", 7, 24),
  (11, "Quinoa", 185, "grams ", 222, 2),
  (12, "Oatmeal", 40, "grams ", 150, 0),
  (13, "Almonds", 28, "grams ", 164, 0),
  (14, "Dark Chocolate", 40, "grams ", 190, 2);