# MySQL

## Content

<!-- toc -->

- [Introduction](#introduction)
- [join](#join)
  * [inner join](#inner-join)
  * [left join](#left-join)
  * [right join](#right-join)
  * [full join](#full-join)
- [regexp](#regexp)
- [case](#case)
- [having](#having)
- [string](#string)
- [number](#number)

<!-- tocstop -->

## Introduction

## join
There are 4 types of joins.

Employee --> id
Address -> country

### inner join
select e.id, country from Employee as e
join Address as a
on e.id = a.employee_id

You will have the list of the employes that have a country in addres

### left join
select e.id, country from Employee as e
left join Address as a
on e.id = a.employee_id

You will have the list of All the employes with country in the right, some countries may be null. if not informed.

### right join
select e.id, country from Employee as e
right join Address as a
on e.id = a.employee_id
where e.id is NULL

You may want to find which address doesn't have a record in employees

### full join
select e.id, country from Employee as e
full join Address as a
on e.id = a.employee_id

Just see all, sometimes id will be null, sometimes country will be null

## regexp

Allows you to execute regex queries. Very similar to like.

Example, query where city doesn't start with vowels or end with vowels.
```
select distinct city from station where city regexp '^[^AEIOU]' or city regexp '[^AEIOU]$'
```

## case

Allows you to have different if cases.

For example, print  a specific test if a situation occurs.

The structure is, case + (when + then) + [else} + end.

```
select case
when a + b <= C then 'Not A Triangle'
when a=b and b=c then 'Equilateral'
when a+b > c and (a=b or b=c or a=c) then 'Isosceles'
else "Scalene"
End
From triangles
```

## having
Sometimes we have to group by, (so only appears one element), and then with having we can select how many rows we had.
```
select h.hacker_id, h.name from hackers as h
join Submissions as s
on  h.hacker_id = s.hacker_id
join challenges as c
on  c.challenge_id = s.challenge_id
join difficulty as d
on d.difficulty_level = c.difficulty_level 
where d.score = s.score 
group by h.hacker_id, h.name
having count(h.hacker_id) > 1
order by count(h.hacker_id) desc, h.hacker_id
```

## string
Some of the functions on strings:
- concat
- substring
- lcase
- ucase

Example using some fo them:
```
select concat(name, '(', substring(occupation, 1, 1), ')') from occupations order by name;
select concat('There are a total of ', count(occupation), ' ', lcase(occupation), 's.') from occupations group by occupation order by count(occupation), occupation;
```

## number
Some of the functions on numbers:
- trucate
- max
- round
- floor

Example: 
```
select max(truncate(lat_n, 4)) from station where lat_n < 137.2345;
```
