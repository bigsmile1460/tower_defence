DELETE FROM Tower;
INSERT INTO Tower (id, towerName, attackPower, attackSpeed, attackRange, attackType, towerPrice, sellPriceRate, upgradeAttackPower, upgradePrice, upgradeAddPrice)
values (1, "원거리 타워", 180, 2000, 500, "singleAttack", 1000, 0.5, 30, 300, 10);
INSERT INTO Tower (id, towerName, attackPower, attackSpeed, attackRange, attackType, towerPrice, sellPriceRate, upgradeAttackPower, upgradePrice, upgradeAddPrice)
values (2,"화염 타워", 30, 3500, 600, "multiAttack", 1600, 0.55, 10, 500, 15);
INSERT INTO Tower (id, towerName, attackPower, attackSpeed, attackRange, attackType, towerPrice, sellPriceRate, upgradeAttackPower, upgradePrice, upgradeAddPrice)
values (3,"치유 타워", 150, 800, 0, "heal", 2000,  0.6, 50, 600, 20);



