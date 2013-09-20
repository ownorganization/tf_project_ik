/* ************************Запрос1************************
brand_versions;
+----+--------------+---------------------+
| id | version_name | version_order_index |
+----+--------------+---------------------+
|  5 | 4 version    |                   1 |
|  4 | 5 version    |                   2 |
|  3 | 6 version    |                   3 |
|  7 | 7 version    |                   4 |
+----+--------------+---------------------+

brand_features;
+----+-----------------------+------------+--------------------+
| id | feature_name          | version_id | feature_is_default |
+----+-----------------------+------------+--------------------+
|  1 | Forex (6)             |          3 |                  0 |
|  2 | Fixed Strikes (6)     |          3 |                  0 |
|  9 | Trading Statistic (5) |          4 |                  0 |
| 10 | Credit Cards (4)      |          5 |                  0 |
| 11 | Test (6)              |          3 |                  0 |
| 12 | Test (7)              |          7 |                  0 |
+----+-----------------------+------------+--------------------+
*/
SELECT 
br_ver_double.version_order_index is null as disabled,
br_ver.version_order_index,
br_ver.version_name,
br_fet.feature_name,
br_fet.feature_is_default
FROM brand_versions AS br_ver 
inner JOIN brand_features AS br_fet
	ON br_ver.id=br_fet.version_id
left JOIN brand_versions AS br_ver_double
	ON br_ver_double.version_order_index<=(SELECT version_order_index FROM brand_versions WHERE id=4)
	AND br_ver_double.id=br_fet.version_id
	ORDER BY br_ver.version_order_index DESC;
/* result_output; Выдаст список всех Фитч и соотвецтвие их активности (disabled) в данный момент для id=4 (5 version)(5 включительно и все ниже, выше - disabled)
, [id=4] - входящая переменная!
+----------+---------------------+--------------+-----------------------+--------------------+
| disabled | version_order_index | version_name | feature_name          | feature_is_default |
+----------+---------------------+--------------+-----------------------+--------------------+
|        1 |                   4 | 7 version    | Test (7)              |                  0 |
|        1 |                   3 | 6 version    | Forex (6)             |                  0 |
|        1 |                   3 | 6 version    | Fixed Strikes (6)     |                  0 |
|        1 |                   3 | 6 version    | Test (6)              |                  0 |
|        0 |                   2 | 5 version    | Trading Statistic (5) |                  0 |
|        0 |                   1 | 4 version    | Credit Cards (4)      |                  0 |
+----------+---------------------+--------------+-----------------------+--------------------+
*/
/* ************************Запрос2************************
brands
+----+----------+------------+--------------------+
| id | brand_id | brand_name | brand_url          |
+----+----------+------------+--------------------+
|  1 |        1 | OptionFair | www.optionfair.com |
|  2 |        2 | 24option   | www.24option.com   |
+----+----------+------------+--------------------+

brand_lang_rel
+----------+---------+
| brand_id | lang_id |
+----------+---------+
|        1 |       4 |
|        1 |       5 |
|        2 |       5 |
+----------+---------+

brand langs
+----+-----------+-----------+
| id | lang_name | lang code |
+----+-----------+-----------+
|  4 | English   | EN        |
|  5 | Franch    | FR        |
|  6 | Spanish   | ES        |
+----+-----------+-----------+
*/
SELECT
id,
lang_name,
brand_id IS NOT NULL AS checked 
FROM brand_langs as br_lag
LEFT JOIN brand_lang_rel as br_lag_rel
 ON brand_id = "1" 
 AND br_lag_rel.lang_id = br_lag.id;
/* result_output; выдаст все языки и покажет checked 1 которые язики активны сейчас для brand_id=1(OptionFair), [brand_id] - входящая переменная!
 +----+-----------+---------+
| id | lang_name | checked |
+----+-----------+---------+
|  4 | English   |       1 |
|  5 | Franch    |       1 |
|  6 | Spanish   |       0 |
+----+-----------+---------+
*/

/* ************************Запрос3************************
tf_members
+----+-------------+
| id | member_name |
+----+-------------+
|  1 | Adva        |
|  2 | Gilad       |
|  3 | Yakov       |
+----+-------------+

brand_member_role_rel;
+----------+-----------+---------+
| brand_id | member_id | role_id |
+----------+-----------+---------+
|        2 |         2 |       1 |
|        1 |         3 |       1 |
+----------+-----------+---------+

brands
+----+----------+------------+--------------------+
| id | brand_id | brand_name | brand_url          |
+----+----------+------------+--------------------+
|  1 |        1 | OptionFair | www.optionfair.com |
|  2 |        2 | 24option   | www.24option.com   |
+----+----------+------------+--------------------+

tf_member_roles
+----+-----------------+
| id | role_name       |
+----+-----------------+
|  1 | Account manager |
|  3 | Content manager |
|  2 | Developer       |
+----+-----------------+
*/
SELECT
member_name
FROM tf_members
	WHERE id=(SELECT member_id FROM brand_member_role_rel WHERE brand_id="1" and role_id='1');
/* result_output; Выдаст имя role_id=1(Account manager) для бренда brand_id=1(OptionFair), [role_id и brand_id] - входящие переменные!
+-------------+
| member_name |
+-------------+
| Yakov       |
+-------------+

ИЛИ ТАК*/
SELECT br_m_r_r.brand_id, tf_m.member_name, tf_m_r.role_name
FROM tf_members as tf_m
INNER JOIN brand_member_role_rel as br_m_r_r
	on tf_m.id=br_m_r_r.member_id
INNER JOIN tf_member_roles as tf_m_r
	on br_m_r_r.role_id=tf_m_r.id
WHERE br_m_r_r.brand_id=2;
/* result_output;  Выдаст именя и роли для для 2 бренда
+----------+-------------+-----------------+
| brand_id | member_name | role_name       |
+----------+-------------+-----------------+
|        2 | Gilad       | Account manager |
|        2 | Gilad       | Developer       |
+----------+-------------+-----------------+
*/

SELECT id,lang_name AS name FROM brand_langs where id in (SELECT lang_id FROM brand_lang_rel WHERE brand_id=1); /*Посмотреть ещё*/

SELECT id,feature_name AS name FROM brand_features where id in (SELECT feature_id FROM brand_feature_rel WHERE brand_id=1 and feature_is_checked=1); /*Посмотреть ещё*/

/*ВАЖНО!!!!*/
SET autocommit=0;

INSERT INTO brands
    (brand_id, brand_name, brand_url)
VALUES
    (100, 'Insert Brand name', 'url');
  
INSERT INTO brand_type_rel
    (brand_id, type_id) 
SELECT id, 2
FROM brands
WHERE brand_id=100;

commit;
SET autocommit=1;

/*Запиь с переменной!!!!*/
SET autocommit=0;

INSERT INTO brands
    (brand_id, brand_name, brand_url)
VALUES
    (240, 'Insert Brand name', 'url');

SELECT @id_brand_var:=id FROM brands WHERE brand_id = 240;

INSERT INTO brand_type_rel
    (brand_id, type_id) 
VALUES
    (@id_brand_var, 2);

commit;
SET autocommit=1;


/*ЗАПИСЬ ДАННЫХ В БД НОВЫЙ БРЕНД*/
SET autocommit=0;

INSERT INTO brands
    (brand_id, brand_name, brand_url)
VALUES
    (240, 'Insert Brand name', 'url');

SELECT @id_brand_var:=id FROM brands WHERE brand_id = 240;

INSERT INTO brand_type_rel
    (brand_id, type_id) 
VALUES
    (@id_brand_var, 2);
    
INSERT INTO brand_version_rel
    (brand_id, version_id) 
VALUES
    (@id_brand_var, 7);

commit;
SET autocommit=1;

/*new*/
SET autocommit=0;
INSERT INTO brand_feature_rel
    (brand_id, feature_id, feature_is_checked)
    VALUES(2, 1,1),(2, 2,0),(2, 9,1);
INSERT INTO brand_lang_rel
    (brand_id, lang_id)
    VALUES(2, 4),(2, 5);
commit;
SET autocommit=1;